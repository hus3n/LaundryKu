'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AutoReplyItem } from '../botSettingsData';

interface BotAutoRepliesSectionProps {
  autoReplies: AutoReplyItem[];
  onAddAutoReply: (keyword: string, reply: string) => Promise<void>;
  onToggleAutoReply: (id: string, isActive: boolean) => Promise<void>;
  onDeleteAutoReply: (id: string) => Promise<void>;
}

export default function BotAutoRepliesSection({
  autoReplies,
  onAddAutoReply,
  onToggleAutoReply,
  onDeleteAutoReply,
}: BotAutoRepliesSectionProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [newReply, setNewReply] = useState('');
  const [isAddingReply, setIsAddingReply] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newReply.trim()) return;
    setIsAddingReply(true);
    try {
      await onAddAutoReply(newKeyword, newReply);
      setNewKeyword('');
      setNewReply('');
    } finally {
      setIsAddingReply(false);
    }
  };

  return (
    <section className="glass-card-dark p-6 rounded-2xl border dark:border-[#1DA9D0]/15 border-slate-200 shadow-sm space-y-6">
      <div>
        <h2 className="font-bold dark:text-[#F5EACA] text-slate-900">Pesan Otomatis Kata Kunci (Auto-Reply)</h2>
        <p className="text-xs dark:text-[#F5EACA]/60 text-slate-500 mt-0.5">
          Balasan instan berdasarkan kata kunci spesifik sebelum dilempar ke AI.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-xl dark:bg-[#012040] bg-slate-50 border dark:border-[#1DA9D0]/15 border-slate-200 space-y-3"
      >
        <h3 className="text-xs font-semibold text-[#1DA9D0] dark:text-[#43D5CC]">Tambah Aturan Baru</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Kata Kunci (cth: harga)"
            className="w-full px-3 py-2 rounded-lg dark:bg-[#010E1C] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0]"
          />
          <input
            type="text"
            required
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Balasan otomatis..."
            className="w-full px-3 py-2 rounded-lg dark:bg-[#010E1C] bg-white border dark:border-[#1DA9D0]/25 border-slate-300 text-xs dark:text-[#F5EACA] text-slate-900 placeholder:text-slate-400 dark:placeholder:text-[#F5EACA]/40 focus:outline-none focus:border-[#1DA9D0] md:col-span-2"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAddingReply}
            className="px-4 py-2 rounded-xl bg-[#1DA9D0] dark:bg-gradient-to-r dark:from-[#1DA9D0] dark:to-[#43D5CC] text-[#010E1C] font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Kata Kunci
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b dark:border-[#1DA9D0]/15 border-slate-200 dark:text-[#F5EACA]/60 text-slate-600 font-semibold dark:bg-[#012040] bg-slate-100">
              <th className="py-3 px-4">Kata Kunci</th>
              <th className="py-3 px-4">Balasan</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-[#1DA9D0]/10 divide-slate-200">
            {autoReplies.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center dark:text-[#F5EACA]/50 text-slate-400">
                  Belum ada aturan kata kunci auto-reply
                </td>
              </tr>
            ) : (
              autoReplies.map((reply) => (
                <tr key={reply._id} className="dark:hover:bg-[#013D66]/50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1DA9D0] dark:text-[#43D5CC]">&quot;{reply.keyword}&quot;</td>
                  <td className="py-3 px-4 dark:text-[#F5EACA]/80 text-slate-700 max-w-[200px] truncate" title={reply.reply}>
                    {reply.reply}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={reply.isActive}
                        onChange={(e) => onToggleAutoReply(reply._id, e.target.checked)}
                      />
                      <div className="w-7 h-4 dark:bg-[#013D66] bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteAutoReply(reply._id)}
                      className="p-1.5 rounded-lg dark:text-[#F5EACA]/60 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
