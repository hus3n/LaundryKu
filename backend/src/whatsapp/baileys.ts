import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  WASocket,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { WASession } from '../models-nosql/waSession.model.js';
import { waQueue } from './messageQueue.js';
import { isMongoConnected } from '../config/mongodb.js';
import { handleIncomingMessagesUpsert } from './botHandler.js';
import {
  sendOrderWANotification,
  sendOrderWANotificationWithImage as sendOrderWANotificationWithImageFn,
  OrderNotificationType,
} from './orderNotification.js';

export interface ActiveSession {
  socket?: WASocket;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  qrCode?: string;
  phoneConnected?: string;
}

const activeSessions: Record<string, ActiveSession> = {};
const SESSIONS_DIR = path.resolve(process.cwd(), 'wa-sessions');

if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

export function isWAConnected(adminId: string): boolean {
  const active = activeSessions[adminId];
  if (!active || active.status !== 'CONNECTED') {
    return false;
  }
  // Simulated mode (connected without socket)
  if (!active.socket && active.status === 'CONNECTED') {
    return true;
  }
  // Real socket check: verify user ID exists and websocket is not closed
  if (active.socket) {
    const hasUser = !!active.socket.user?.id;
    const ws = (active.socket as any).ws;
    const isWsOpen = ws ? ws.readyState === 1 : true;
    return hasUser && isWsOpen;
  }
  return false;
}

export async function getWASessionStatus(adminId: string) {
  let active = activeSessions[adminId];
  const sessionAuthDir = path.join(SESSIONS_DIR, adminId);
  const credsFile = path.join(sessionAuthDir, 'creds.json');

  // Verify real socket health if in CONNECTED state
  if (active?.status === 'CONNECTED' && active?.socket) {
    const isSocketAlive = isWAConnected(adminId);
    if (!isSocketAlive) {
      console.log(`⚠️ Active socket for ${adminId} is disconnected/stale. Updating status to CONNECTING.`);
      active.status = 'CONNECTING';
    }
  }

  // Auto-reconnect if session folder on disk contains creds.json but in-memory active session is missing
  if (!active && fs.existsSync(credsFile)) {
    activeSessions[adminId] = { status: 'CONNECTING' };
    initiateWAPairing(adminId).catch((e) => console.error('Auto WA reconnect failed:', e.message));
    active = activeSessions[adminId];
  }

  if (active) {
    return {
      adminId,
      status: active.status,
      qrCode: active.qrCode,
      phoneConnected: active.phoneConnected,
      pendingQueueCount: waQueue.getPendingCount(adminId),
    };
  }

  // If no in-memory active session and no creds.json on disk, it is DISCONNECTED
  return {
    adminId,
    status: 'DISCONNECTED' as const,
    qrCode: undefined,
    phoneConnected: undefined,
    pendingQueueCount: waQueue.getPendingCount(adminId),
  };
}

export async function initiateWAPairing(adminId: string) {
  // Clean up any previous socket instance for this admin
  const previousActive = activeSessions[adminId];
  if (previousActive?.socket) {
    try {
      previousActive.socket.ev.removeAllListeners('connection.update');
      previousActive.socket.ev.removeAllListeners('creds.update');
      previousActive.socket.ev.removeAllListeners('messages.upsert');
      previousActive.socket.end(undefined);
    } catch (e) {}
  }

  const sessionAuthDir = path.join(SESSIONS_DIR, adminId);
  if (!fs.existsSync(sessionAuthDir)) {
    fs.mkdirSync(sessionAuthDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionAuthDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    defaultQueryTimeoutMs: 60000,
  });

  activeSessions[adminId] = {
    socket: sock,
    status: 'CONNECTING',
  };

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        const qrDataUrl = await QRCode.toDataURL(qr);
        activeSessions[adminId].qrCode = qrDataUrl;
        activeSessions[adminId].status = 'CONNECTING';

        try {
          if (isMongoConnected()) {
            await WASession.findOneAndUpdate(
              { adminId },
              { status: 'CONNECTING', qrCode: qrDataUrl },
              { upsert: true }
            );
          }
        } catch (e) {}
      } catch (err) {
        console.error('Error generating QR Data URL:', err);
      }
    }

    if (connection === 'open') {
      const userPhone = sock.user?.id ? sock.user.id.split(':')[0] : 'Connected';
      activeSessions[adminId].status = 'CONNECTED';
      activeSessions[adminId].phoneConnected = userPhone;
      activeSessions[adminId].qrCode = undefined;

      console.log(`✅ WhatsApp Connected for admin ${adminId} (${userPhone})`);
      waQueue.triggerQueue();

      try {
        if (isMongoConnected()) {
          await WASession.findOneAndUpdate(
            { adminId },
            { status: 'CONNECTED', phoneConnected: userPhone, qrCode: undefined },
            { upsert: true }
          );
        }
      } catch (e) {}
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(`⚠️ WhatsApp connection closed for ${adminId}. Reason code: ${statusCode}`);

      if (shouldReconnect) {
        console.log(`🔄 Reconnecting WhatsApp for ${adminId}...`);
        initiateWAPairing(adminId);
      } else {
        console.log(`❌ WhatsApp logged out for ${adminId}`);
        activeSessions[adminId] = { status: 'DISCONNECTED' };

        if (fs.existsSync(sessionAuthDir)) {
          fs.rmSync(sessionAuthDir, { recursive: true, force: true });
        }

        try {
          if (isMongoConnected()) {
            await WASession.findOneAndUpdate(
              { adminId },
              { status: 'DISCONNECTED', qrCode: undefined, phoneConnected: undefined },
              { upsert: true }
            );
          }
        } catch (e) {}
      }
    }
  });

  // Listener for incoming customer messages (delegated to botHandler)
  sock.ev.on('messages.upsert', async (m) => {
    await handleIncomingMessagesUpsert(sock, adminId, m);
  });

  return new Promise<{ status: string; qrCode?: string }>((resolve) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const current = activeSessions[adminId];
      if (current?.qrCode || current?.status === 'CONNECTED' || attempts >= 15) {
        clearInterval(interval);
        resolve({
          status: current?.status || 'CONNECTING',
          qrCode: current?.qrCode,
        });
      }
    }, 500);
  });
}

export async function sendRealWAMessage(adminId: string, phone: string, message: string): Promise<boolean> {
  const active = activeSessions[adminId];
  let formattedPhone = phone.replace(/[^0-9]/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.slice(1);
  }
  const jid = `${formattedPhone}@s.whatsapp.net`;

  if (active?.socket && active.status === 'CONNECTED') {
    try {
      await active.socket.sendMessage(jid, { text: message });
      console.log(`📱 Real Baileys WA sent to ${formattedPhone}`);
      return true;
    } catch (err: any) {
      console.error(`❌ Error sending WA message to ${formattedPhone}:`, err.message);
      const isAuthError =
        err.message?.includes('Logged Out') ||
        err.message?.includes('401') ||
        err.output?.statusCode === 401 ||
        err.output?.statusCode === DisconnectReason.loggedOut;

      if (isAuthError) {
        console.log(`❌ Session invalid/expired for ${adminId}. Resetting session.`);
        await disconnectWASession(adminId);
      }
      return false;
    }
  } else if (active?.status === 'CONNECTED' && !active?.socket) {
    console.log(`📱 [Simulated WA Mode] Pesan sukses disimulasikan ke ${formattedPhone}: ${message.slice(0, 40)}...`);
    return true;
  } else {
    console.log(`ℹ️ Socket not connected for ${adminId}, message queued.`);
    return false;
  }
}

export async function initAllSavedWASessions() {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) return;
    const entries = fs.readdirSync(SESSIONS_DIR);
    for (const adminId of entries) {
      const sessionAuthDir = path.join(SESSIONS_DIR, adminId);
      if (fs.statSync(sessionAuthDir).isDirectory()) {
        const credsFile = path.join(sessionAuthDir, 'creds.json');
        if (fs.existsSync(credsFile)) {
          console.log(`🔄 Auto-restoring WhatsApp session for ${adminId}...`);
          initiateWAPairing(adminId).catch((err) => {
            console.error(`❌ Failed to auto-restore WA session for ${adminId}:`, err.message);
          });
        }
      }
    }
  } catch (err: any) {
    console.error('Error auto-restoring WA sessions:', err.message);
  }
}

export async function disconnectWASession(adminId: string) {
  const active = activeSessions[adminId];
  if (active?.socket) {
    try {
      active.socket.ev.removeAllListeners('connection.update');
      active.socket.ev.removeAllListeners('creds.update');
      active.socket.ev.removeAllListeners('messages.upsert');
      await active.socket.logout().catch(() => {});
      active.socket.end(undefined);
    } catch (e) {}
  }

  const sessionAuthDir = path.join(SESSIONS_DIR, adminId);
  if (fs.existsSync(sessionAuthDir)) {
    try {
      fs.rmSync(sessionAuthDir, { recursive: true, force: true });
    } catch (e) {
      console.error('Error removing auth dir on disconnect:', e);
    }
  }

  activeSessions[adminId] = {
    status: 'DISCONNECTED',
    socket: undefined,
    qrCode: undefined,
    phoneConnected: undefined,
  };

  try {
    if (isMongoConnected()) {
      await WASession.findOneAndUpdate(
        { adminId },
        { status: 'DISCONNECTED', qrCode: undefined, phoneConnected: undefined },
        { upsert: true }
      );
    }
  } catch (e) {}

  return true;
}

export async function disconnectAllWASessionsForRestore() {
  console.log('🔄 Disconnecting all active WhatsApp sockets for backup restore...');
  for (const adminId of Object.keys(activeSessions)) {
    const active = activeSessions[adminId];
    if (active?.socket) {
      try {
        active.socket.ev.removeAllListeners('connection.update');
        active.socket.ev.removeAllListeners('creds.update');
        active.socket.ev.removeAllListeners('messages.upsert');
        active.socket.end(undefined);
      } catch (e) {}
    }
    delete activeSessions[adminId];
  }
}

export async function confirmWAPairingSimulated(adminId: string, phone: string) {
  activeSessions[adminId] = {
    status: 'CONNECTED',
    phoneConnected: phone,
    qrCode: undefined,
  };

  try {
    if (isMongoConnected()) {
      await WASession.findOneAndUpdate(
        { adminId },
        { status: 'CONNECTED', phoneConnected: phone, qrCode: null as any },
        { upsert: true }
      );
    }
  } catch (e) {}

  return {
    status: 'CONNECTED',
    phoneConnected: phone,
  };
}

export { sendOrderWANotification };

export async function sendOrderWANotificationWithImage(
  adminId: string,
  order: any,
  type: OrderNotificationType
): Promise<boolean> {
  const socket = activeSessions[adminId]?.socket;
  return sendOrderWANotificationWithImageFn(adminId, order, type, socket);
}
