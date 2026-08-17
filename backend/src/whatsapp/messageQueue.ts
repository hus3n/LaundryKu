import fs from 'fs';
import path from 'path';
import { WAMessageLog } from '../models-nosql/waMessageLog.model.js';
import { sendRealWAMessage, isWAConnected } from './baileys.js';
import { isMongoConnected } from '../config/mongodb.js';

export interface WAJob {
  id: string;
  adminId: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  createdAt: string;
  attempts?: number;
}

const QUEUE_FILE = path.resolve(process.cwd(), 'wa-sessions', 'pending-queue.json');

class WAMessageQueue {
  private queue: WAJob[] = [];
  private isProcessing = false;
  private delayMs = 10000; // 10 seconds safe rate-limit delay between messages

  constructor() {
    this.loadQueueFromDisk();
  }

  private loadQueueFromDisk() {
    try {
      if (fs.existsSync(QUEUE_FILE)) {
        const data = fs.readFileSync(QUEUE_FILE, 'utf-8');
        this.queue = JSON.parse(data);
        console.log(`📦 Loaded ${this.queue.length} pending WA messages from disk.`);
      }
    } catch (e) {
      this.queue = [];
    }
  }

  private saveQueueToDisk() {
    try {
      const dir = path.dirname(QUEUE_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(this.queue, null, 2));
    } catch (e) {
      console.error('Failed to save WA queue to disk:', e);
    }
  }

  public enqueue(job: Omit<WAJob, 'id' | 'createdAt' | 'attempts'>) {
    const fullJob: WAJob = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };

    this.queue.push(fullJob);
    this.saveQueueToDisk();

    console.log(
      `📩 WA Job queued for ${fullJob.recipientName} (${fullJob.recipientPhone}). Total in queue: ${this.queue.length}`
    );

    this.triggerQueue();
  }

  public triggerQueue() {
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  public getPendingCount(adminId?: string): number {
    if (adminId) {
      return this.queue.filter((j) => j.adminId === adminId).length;
    }
    return this.queue.length;
  }

  public clearQueue(adminId?: string): number {
    const initialCount = this.queue.length;
    if (adminId) {
      this.queue = this.queue.filter((j) => j.adminId !== adminId);
    } else {
      this.queue = [];
    }
    this.saveQueueToDisk();
    return initialCount - this.queue.length;
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    // Find the first job whose admin is connected
    const readyJobIndex = this.queue.findIndex((job) => isWAConnected(job.adminId));

    if (readyJobIndex === -1) {
      // All queued jobs are for disconnected admins. Hold processing.
      console.log(
        `⏸️ WA Pending Queue: ${this.queue.length} message(s) holding because WhatsApp is disconnected/expired.`
      );
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const [job] = this.queue.splice(readyJobIndex, 1);
    this.saveQueueToDisk();

    try {
      console.log(`🚀 Sending WA message to ${job.recipientName} (${job.recipientPhone})...`);

      // Send real WhatsApp message via Baileys socket
      const sent = await sendRealWAMessage(job.adminId, job.recipientPhone, job.message);

      if (sent) {
        console.log(`✅ WA message successfully sent to ${job.recipientPhone}`);
        // Record success log in MongoDB (if available)
        try {
          if (isMongoConnected()) {
            await WAMessageLog.create({
              adminId: job.adminId,
              recipientPhone: job.recipientPhone,
              recipientName: job.recipientName,
              message: job.message,
              status: 'SENT',
              sentAt: new Date(),
            });
          }
        } catch (e) {}
      } else {
        const attempts = (job.attempts || 0) + 1;
        if (attempts < 3) {
          console.warn(`⚠️ WA message sending failed for ${job.recipientPhone} (Attempt ${attempts}/3), re-queuing...`);
          job.attempts = attempts;
          this.queue.push(job);
          this.saveQueueToDisk();
        } else {
          console.error(`❌ WA message discarded for ${job.recipientPhone} after 3 failed attempts.`);
          try {
            if (isMongoConnected()) {
              await WAMessageLog.create({
                adminId: job.adminId,
                recipientPhone: job.recipientPhone,
                recipientName: job.recipientName,
                message: job.message,
                status: 'FAILED',
                sentAt: new Date(),
              });
            }
          } catch (e) {}
        }
      }
    } catch (error: any) {
      console.error(`❌ Failed sending WA message to ${job?.recipientPhone}:`, error.message);
    }

    // Mandatory 10 seconds delay before processing next message in queue
    console.log(`⏳ Waiting 10s delay for WA rate-limit safety... (${this.queue.length} left in queue)`);
    setTimeout(() => {
      this.processQueue();
    }, this.delayMs);
  }
}

export const waQueue = new WAMessageQueue();
