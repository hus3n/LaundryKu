import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export interface SendResetPasswordEmailParams {
  to: string;
  name: string;
  resetToken: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetToken,
}: SendResetPasswordEmailParams): Promise<{ sent: boolean; message: string }> {
  const frontendUrl = (
    env.FRONTEND_URL ||
    env.APP_URL ||
    'https://laundryku.forapp.id'
  ).replace(/\/$/, '');

  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const host = env.SMTP_HOST;
  const port = parseInt(env.SMTP_PORT || '587', 10);
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const secure = env.SMTP_SECURE === 'true' || port === 465;
  const from = env.SMTP_FROM || `"LaundryKu POS" <${user || 'no-reply@laundryku.com'}>`;

  // Jika konfigurasi SMTP belum diisi (misal di local dev), catat log URL untuk kemudahan testing
  if (!host || !user || !pass) {
    console.warn(
      `[EMAIL] SMTP belum dikonfigurasi. Link reset password untuk ${to}: ${resetUrl}`
    );
    return {
      sent: false,
      message: 'SMTP belum dikonfigurasi, link dicatat di log server.',
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Kata Sandi LaundryKu</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
      <!-- Header -->
      <tr>
        <td style="background-color: #010E1C; padding: 32px 28px; text-align: center;">
          <div style="display: inline-block; background-color: #1DA9D0; color: #010E1C; font-weight: 900; font-size: 20px; padding: 10px 18px; border-radius: 12px; margin-bottom: 8px;">
            🧺 LaundryKu
          </div>
          <p style="color: #43D5CC; margin: 4px 0 0 0; font-size: 13px; font-weight: 600;">Sistem Manajemen &amp; Kasir POS Laundry</p>
        </td>
      </tr>

      <!-- Body Content -->
      <tr>
        <td style="padding: 32px 28px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 14px;">
            Permintaan Reset Kata Sandi
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
            Halo <strong>${name}</strong>,<br>
            Kami menerima permintaan untuk mereset kata sandi akun LaundryKu yang terhubung dengan alamat email ini (<strong>${to}</strong>).
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 28px;">
            Silakan klik tombol di bawah ini untuk membuat kata sandi baru akun Anda:
          </p>

          <!-- Button -->
          <div style="text-align: center; margin-bottom: 28px;">
            <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #1DA9D0; color: #010E1C; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 8px rgba(29, 169, 208, 0.25);">
              🔑 Buat Kata Sandi Baru
            </a>
          </div>

          <div style="background-color: #f8fafc; border-left: 4px solid #1DA9D0; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
            ⏳ <strong>Penting:</strong> Tautan ini hanya berlaku selama <strong>24 jam</strong>. Jika Anda tidak pernah meminta perubahan ini, silakan abaikan email ini dan akun Anda akan tetap aman.
          </div>

          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
            Jika tombol di atas tidak dapat diklik, salin tautan berikut ke peramban (browser) Anda:<br>
            <a href="${resetUrl}" target="_blank" style="color: #1DA9D0; word-break: break-all;">${resetUrl}</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94a3b8;">
          © 2026 LaundryKu POS. Hak cipta dilindungi undang-undang.<br>
          Platform SaaS Kasir dan Otomasi Usaha Laundry Indonesia.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: 'Reset Kata Sandi Akun LaundryKu',
      html: htmlContent,
    });
    console.info(`[EMAIL] Reset password email berhasil dikirim ke: ${to}`);
    return { sent: true, message: 'Email berhasil dikirim.' };
  } catch (error: any) {
    console.error(`[EMAIL] Gagal mengirim email reset password ke ${to}:`, error.message);
    return { sent: false, message: error.message };
  }
}
