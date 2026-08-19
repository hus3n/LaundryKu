'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import {
  Bot,
  Cloud,
  CloudUpload,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Database,
  Send,
  Unlink,
  FileArchive,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function BackupRestorePage() {
  // Confirm Modals state
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

  // Telegram state
  const [telegramStatus, setTelegramStatus] = useState<{
    isConnected: boolean;
    botUsername?: string;
    chatId?: string;
  }>({ isConnected: false });
  const [botToken, setBotToken] = useState('');
  const [chatIdInput, setChatIdInput] = useState('');
  const [connectingBot, setConnectingBot] = useState(false);

  // Backup state
  const [backups, setBackups] = useState<any[]>([]);
  const [backingUp, setBackingUp] = useState(false);
  const [backupResult, setBackupResult] = useState<string | null>(null);

  // Restore state
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

  // ─── Telegram Handlers ───

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

  // ─── Backup Handlers ───

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

  // ─── Restore Handler ───

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
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1DA9D0] to-[#43D5CC] flex items-center justify-center shadow-lg shadow-[#1DA9D0]/20">
            <Database className="w-5 h-5 text-[#010E1C]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F5EACA]">Backup & Restore</h1>
            <p className="text-xs text-[#F5EACA]/60">Kelola backup otomatis ke Telegram & restore data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ═══════════════════════════════════════════ */}
          {/* LEFT: Telegram Bot Connection */}
          {/* ═══════════════════════════════════════════ */}
          <div className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-5">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-[#43D5CC]" />
              <h2 className="text-sm font-bold text-[#F5EACA]">Hubungkan Bot Telegram</h2>
              {telegramStatus.isConnected && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terhubung
                </span>
              )}
            </div>

            {telegramStatus.isConnected ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#F5EACA]/60">Bot Username</span>
                    <span className="text-xs font-mono text-[#43D5CC]">@{telegramStatus.botUsername}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#F5EACA]/60">Chat ID</span>
                    <span className="text-xs font-mono text-emerald-300">
                      {telegramStatus.chatId || (
                        <span className="text-[#EA8803]">Belum diset - kirim /start ke bot</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#F5EACA]/60">Auto Backup</span>
                    <span className="text-xs text-emerald-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Setiap 1 Jam
                    </span>
                  </div>
                </div>

                {!telegramStatus.chatId && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-[#EA8803]">
                      💡 Chat ID bisa diisi otomatis dengan kirim <strong>/start</strong> ke bot Anda di Telegram, atau masukkan manual:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatIdInput}
                        onChange={(e) => setChatIdInput(e.target.value)}
                        placeholder="Masukkan Chat ID"
                        className="flex-1 px-3 py-2 rounded-lg bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0]"
                      />
                      <button
                        onClick={handleSetChatId}
                        className="px-3 py-2 rounded-lg bg-[#1DA9D0]/20 text-[#43D5CC] border border-[#1DA9D0]/30 text-xs font-semibold hover:bg-[#1DA9D0]/30 transition-colors"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDisconnectBot}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Unlink className="w-3.5 h-3.5" /> Putuskan Bot Telegram
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#1DA9D0]/10 border border-[#1DA9D0]/20 text-[11px] text-[#43D5CC] space-y-2">
                  <p className="font-semibold">📋 Cara Membuat Bot Telegram:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[#F5EACA]/60">
                    <li>Buka Telegram, cari <strong>@BotFather</strong></li>
                    <li>Kirim <strong>/newbot</strong>, ikuti instruksinya</li>
                    <li>Salin <strong>Token Bot</strong> yang diberikan BotFather</li>
                    <li>Paste token di kolom bawah ini</li>
                  </ol>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1.5">Token Bot Telegram</label>
                  <input
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#012040] border border-[#1DA9D0]/25 text-xs text-[#F5EACA] placeholder-[#1DA9D0]/40 focus:outline-none focus:border-[#1DA9D0] focus:ring-2 focus:ring-[#1DA9D0]/20 transition-all font-mono"
                  />
                </div>

                <button
                  onClick={handleConnectBot}
                  disabled={connectingBot || !botToken.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1DA9D0] to-[#43D5CC] hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#1DA9D0]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {connectingBot ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  {connectingBot ? 'Menghubungkan...' : 'Hubungkan Bot Telegram'}
                </button>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════ */}
          {/* RIGHT: Backup & Restore */}
          {/* ═══════════════════════════════════════════ */}
          <div className="space-y-6">
            {/* Backup Section */}
            <div className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-[#F5EACA]">Backup Database</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleTriggerBackup}
                  disabled={backingUp}
                  className="py-3 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {backingUp ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {backingUp ? 'Sedang Backup...' : 'Backup → Telegram'}
                </button>

                <button
                  onClick={handleDownloadBackup}
                  className="py-3 rounded-xl bg-[#1DA9D0]/10 text-[#43D5CC] border border-[#1DA9D0]/30 text-xs font-semibold hover:bg-[#1DA9D0]/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" /> Download Lokal
                </button>
              </div>

              {backupResult && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{backupResult}</span>
                </div>
              )}

              {/* Recent backups */}
              {backups.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] text-[#F5EACA]/50 font-semibold uppercase tracking-wider">Riwayat Backup Lokal</p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {backups.slice(0, 5).map((b, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#012040] border border-[#1DA9D0]/15">
                        <div className="flex items-center gap-2">
                          <FileArchive className="w-3.5 h-3.5 text-[#1DA9D0]/40" />
                          <span className="text-[11px] text-[#F5EACA]/80 font-mono truncate max-w-[200px]">{b.fileName}</span>
                        </div>
                        <span className="text-[10px] text-[#F5EACA]/50">{formatFileSize(b.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Restore Section */}
            <div className="glass-card-dark p-6 rounded-2xl border border-[#1DA9D0]/15 space-y-4">
              <div className="flex items-center gap-2.5">
                <CloudUpload className="w-5 h-5 text-[#EA8803]" />
                <h2 className="text-sm font-bold text-[#F5EACA]">Restore Backup</h2>
              </div>

              <div className="p-3 rounded-xl bg-[#EA8803]/10 border border-[#EA8803]/30 text-[11px] text-[#EA8803] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Perhatian:</strong> Proses restore akan menghapus seluruh data saat ini dan menggantinya dengan data dari file backup. Pastikan Anda telah membuat backup terbaru sebelum melanjutkan.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F5EACA]/80 mb-1.5">Upload File Backup (.zip)</label>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-[#F5EACA]/60 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#013D66] file:text-[#F5EACA] hover:file:bg-[#014775] cursor-pointer"
                  />
                  {restoreFile && (
                    <p className="text-[11px] text-[#F5EACA]/60 mt-1">
                      📁 {restoreFile.name} ({formatFileSize(restoreFile.size)})
                    </p>
                  )}
                </div>

                <button
                  onClick={handleRestore}
                  disabled={restoring || !restoreFile}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EA8803] to-[#EA8803]/80 hover:opacity-95 text-[#010E1C] font-bold text-xs shadow-lg shadow-[#EA8803]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {restoring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sedang Melakukan Restore...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Jalankan Restore
                    </>
                  )}
                </button>
              </div>

              {restoreResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    restoreResult.success
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {restoreResult.success ? (
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{restoreResult.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Confirm Actions */}
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
