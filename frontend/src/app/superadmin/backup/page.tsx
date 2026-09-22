'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Database } from 'lucide-react';
import TelegramBotCard from './components/TelegramBotCard';
import DatabaseBackupCard from './components/DatabaseBackupCard';
import DatabaseRestoreCard from './components/DatabaseRestoreCard';

export default function BackupRestorePage() {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    action?: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });
  const [isConfirming, setIsConfirming] = useState(false);

  const [telegramStatus, setTelegramStatus] = useState<{
    isConnected: boolean;
    botUsername?: string;
    chatId?: string;
  }>({ isConnected: false });
  const [botToken, setBotToken] = useState('');
  const [chatIdInput, setChatIdInput] = useState('');
  const [connectingBot, setConnectingBot] = useState(false);

  const [backups, setBackups] = useState<any[]>([]);
  const [backingUp, setBackingUp] = useState(false);
  const [backupResult, setBackupResult] = useState<string | null>(null);

  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadTelegramStatus = async () => {
    try {
      const res = await api.get('/backup/telegram/status');
      setTelegramStatus(res.data.data);
    } catch (err) {
      console.error('Failed to load telegram status', err);
    }
  };

  const loadBackups = async () => {
    try {
      const res = await api.get('/backup/list');
      setBackups(res.data.data || []);
    } catch (err) {
      console.error('Failed to load backups', err);
    }
  };

  useEffect(() => {
    loadTelegramStatus();
    loadBackups();
  }, []);

  const handleConnectBot = async () => {
    if (!botToken.trim()) {
      alert('Masukkan Token Bot Telegram!');
      return;
    }
    setConnectingBot(true);
    try {
      const res = await api.post('/backup/telegram/connect', { token: botToken.trim() });
      alert(res.data.message);
      loadTelegramStatus();
      setBotToken('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghubungkan bot Telegram.');
    } finally {
      setConnectingBot(false);
    }
  };

  const handleSetChatId = async () => {
    if (!chatIdInput.trim()) {
      alert('Masukkan Chat ID Telegram!');
      return;
    }
    try {
      await api.post('/backup/telegram/chat-id', { chatId: chatIdInput.trim() });
      alert('Chat ID berhasil diset!');
      loadTelegramStatus();
      setChatIdInput('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan Chat ID.');
    }
  };

  const handleDisconnectBot = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Putuskan Bot Telegram',
      message: 'Apakah Anda yakin ingin memutuskan integrasi bot Telegram? Layanan auto-backup otomatis akan dihentikan.',
      type: 'warning',
      action: async () => {
        try {
          await api.post('/backup/telegram/disconnect');
          loadTelegramStatus();
        } catch (err: any) {
          console.error('Gagal memutuskan bot.', err);
        }
      },
    });
  };

  const handleTriggerBackup = async () => {
    setBackingUp(true);
    setBackupResult(null);
    try {
      const res = await api.post('/backup/trigger');
      setBackupResult(res.data.message);
      loadBackups();
    } catch (err: any) {
      setBackupResult(err.response?.data?.error || 'Backup gagal.');
    } finally {
      setBackingUp(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await api.get('/backup/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `laundryku-backup-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.zip`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error('Gagal mendownload backup.', err);
    }
  };

  const handleRestore = () => {
    if (!restoreFile) {
      setRestoreResult({
        success: false,
        message: 'Silakan pilih file backup (.zip) terlebih dahulu.',
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: '⚠️ Konfirmasi Restore Database',
      message: 'PERINGATAN: Proses restore akan MENGHAPUS seluruh data aktif saat ini dan menggantinya dengan data dari file backup ZIP. Apakah Anda yakin ingin melanjutkan?',
      type: 'danger',
      action: async () => {
        setRestoring(true);
        setRestoreResult(null);

        try {
          const formData = new FormData();
          formData.append('backupFile', restoreFile);

          const res = await api.post('/backup/restore', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 120000,
          });

          setRestoreResult({
            success: true,
            message: res.data.message,
          });
          setRestoreFile(null);
        } catch (err: any) {
          setRestoreResult({
            success: false,
            message: err.response?.data?.error || 'Restore gagal. Pastikan file backup valid.',
          });
        } finally {
          setRestoring(false);
        }
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout role="SUPERADMIN">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1DA9D0] to-[#43D5CC] flex items-center justify-center shadow-lg shadow-[#1DA9D0]/20">
            <Database className="w-5 h-5 text-[#010E1C]" />
          </div>
          <div>
            <h1 className="text-xl font-bold dark:text-[#F5EACA] text-slate-900">Backup & Restore</h1>
            <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500">Kelola backup otomatis ke Telegram & restore data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TelegramBotCard
            telegramStatus={telegramStatus}
            botToken={botToken}
            setBotToken={setBotToken}
            chatIdInput={chatIdInput}
            setChatIdInput={setChatIdInput}
            connectingBot={connectingBot}
            onConnectBot={handleConnectBot}
            onSetChatId={handleSetChatId}
            onDisconnectBot={handleDisconnectBot}
          />

          <div className="space-y-6">
            <DatabaseBackupCard
              backingUp={backingUp}
              backupResult={backupResult}
              backups={backups}
              onTriggerBackup={handleTriggerBackup}
              onDownloadBackup={handleDownloadBackup}
              formatFileSize={formatFileSize}
            />

            <DatabaseRestoreCard
              restoreFile={restoreFile}
              setRestoreFile={setRestoreFile}
              restoring={restoring}
              restoreResult={restoreResult}
              onRestore={handleRestore}
              formatFileSize={formatFileSize}
            />
          </div>
        </div>

        <AnimatePresence>
          {confirmModal.isOpen && (
            <ConfirmModal
              isOpen={confirmModal.isOpen}
              title={confirmModal.title}
              message={confirmModal.message}
              type={confirmModal.type || 'danger'}
              isSubmitting={isConfirming}
              onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              onConfirm={async () => {
                if (confirmModal.action) {
                  setIsConfirming(true);
                  await confirmModal.action();
                  setIsConfirming(false);
                }
                setConfirmModal({ ...confirmModal, isOpen: false });
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
