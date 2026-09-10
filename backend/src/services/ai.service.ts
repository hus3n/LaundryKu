import { SuperadminConfig } from '../models-nosql/superadminConfig.model.js';
import { BotConfig } from '../models-nosql/botConfig.model.js';
import { prisma } from '../config/database.js';

export interface AiRequestOptions {
  apiKey: string;
  provider?: string | null;
  baseUrl?: string | null;
  model?: string | null;
  systemPrompt?: string | null;
  userMessage: string;
}

export interface AiResponse {
  success: boolean;
  reply?: string;
  modelUsed?: string;
  providerUsed?: string;
  error?: string;
}

/**
 * Normalizes baseUrl by trimming trailing slashes and ensuring appropriate prefix
 */
function cleanBaseUrl(url: string): string {
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

/**
 * Universal AI Caller
 * Supports standard OpenAI-compatible endpoints (OpenAI, DeepSeek, Groq, OpenRouter, Mistral, Together, Ollama, Custom proxies)
 * as well as native Anthropic Claude and Google Gemini APIs.
 */
export async function queryAiAssistant(options: AiRequestOptions): Promise<AiResponse> {
  const { apiKey, userMessage } = options;
  if (!apiKey || !apiKey.trim()) {
    return { success: false, error: 'API Key tidak boleh kosong.' };
  }

  const provider = (options.provider || 'custom').toLowerCase().trim();
  const customBaseUrl = options.baseUrl ? cleanBaseUrl(options.baseUrl) : '';
  const systemPrompt =
    options.systemPrompt ||
    'Anda adalah asisten AI ramah dan profesional untuk layanan LaundryKu. Jawab dengan sopan, singkat, jelas, dan informatif.';

  try {
    // 1. ANTHROPIC CLAUDE NATIVE API
    if (provider === 'anthropic' || provider === 'claude') {
      const endpoint = customBaseUrl ? `${customBaseUrl}/messages` : 'https://api.anthropic.com/v1/messages';
      const model = options.model || 'claude-3-5-sonnet-20241022';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { success: false, error: `Anthropic API Error (${res.status}): ${errText}` };
      }

      const data: any = await res.json();
      const reply = data.content?.[0]?.text || '(Tidak ada respon teks dari Claude)';
      return { success: true, reply, modelUsed: model, providerUsed: 'anthropic' };
    }

    // 2. GOOGLE GEMINI NATIVE API (if not using custom OpenAI-compatible proxy)
    if ((provider === 'gemini' || provider === 'google') && !customBaseUrl.includes('openai')) {
      const model = options.model || 'gemini-1.5-flash';
      const baseUrl = customBaseUrl || 'https://generativelanguage.googleapis.com/v1beta';
      const endpoint = `${baseUrl}/models/${model}:generateContent?key=${apiKey.trim()}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { success: false, error: `Gemini API Error (${res.status}): ${errText}` };
      }

      const data: any = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || '(Tidak ada respon teks dari Gemini)';
      return { success: true, reply, modelUsed: model, providerUsed: 'gemini' };
    }

    // 3. OPENAI & ALL OPENAI-COMPATIBLE PROVIDERS (DeepSeek, Groq, OpenRouter, Mistral, Ollama, Together, Custom)
    let targetBaseUrl = customBaseUrl;
    let defaultModel = 'gpt-4o-mini';

    if (!targetBaseUrl) {
      switch (provider) {
        case 'openai':
          targetBaseUrl = 'https://api.openai.com/v1';
          defaultModel = 'gpt-4o-mini';
          break;
        case 'deepseek':
          targetBaseUrl = 'https://api.deepseek.com/v1';
          defaultModel = 'deepseek-chat';
          break;
        case 'groq':
          targetBaseUrl = 'https://api.groq.com/openai/v1';
          defaultModel = 'llama-3.3-70b-versatile';
          break;
        case 'openrouter':
          targetBaseUrl = 'https://openrouter.ai/api/v1';
          defaultModel = 'openai/gpt-4o-mini';
          break;
        case 'ollama':
          targetBaseUrl = 'http://localhost:11434/v1';
          defaultModel = 'llama3';
          break;
        default:
          targetBaseUrl = 'https://api.openai.com/v1';
          defaultModel = 'gpt-4o-mini';
          break;
      }
    }

    const model = options.model?.trim() || defaultModel;

    // Normalize endpoint path: if targetBaseUrl doesn't end with /chat/completions, append it
    let chatEndpoint = targetBaseUrl;
    if (!chatEndpoint.endsWith('/chat/completions')) {
      if (chatEndpoint.endsWith('/v1')) {
        chatEndpoint = `${chatEndpoint}/chat/completions`;
      } else {
        chatEndpoint = `${chatEndpoint}/chat/completions`;
      }
    }

    const res = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: `AI API Error (${res.status}) pada ${chatEndpoint}: ${errText}`,
      };
    }

    const data: any = await res.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() || '(Tidak ada respon teks dari penyedia AI)';

    return {
      success: true,
      reply,
      modelUsed: model,
      providerUsed: provider || 'custom',
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Gagal menghubungi server AI: ${err.message || 'Unknown network error'}`,
    };
  }
}

/**
 * Test AI Connection with a simple prompt
 */
export async function testAiConnection(options: Omit<AiRequestOptions, 'userMessage'>): Promise<AiResponse> {
  return queryAiAssistant({
    ...options,
    userMessage: 'Halo! Tolong jawab dengan 1 kalimat singkat bahwa koneksi AI berhasil terhubung ke LaundryKu.',
  });
}

export async function processAiMessageWithCentralConfig(
  adminId: string, 
  userMessage: string
): Promise<{ success: boolean; reply?: string; fallback?: boolean }> {
  try {
    const config = await BotConfig.findOne({ adminId });
    if (!config || !config.isAiActive || !config.isAiEnabledBySuperadmin) {
      return { success: false, fallback: true };
    }

    // Lazy Reset Check
    const todayStr = new Date().toDateString();
    const lastUsedStr = config.aiLastUsedDate ? new Date(config.aiLastUsedDate).toDateString() : '';
    if (todayStr !== lastUsedStr) {
      config.aiUsageToday = 0;
      config.aiLastUsedDate = new Date();
      await config.save();
    }

    // Quota Check
    const dailyLimit = config.aiDailyLimit || 100;
    if (config.aiUsageToday >= dailyLimit) {
      console.log(`[AI Quota Exceeded] Admin ${adminId} hit ${config.aiUsageToday}/${dailyLimit}`);
      return { success: false, fallback: true };
    }

    // Global Config Check
    const superConfig = await SuperadminConfig.findOne();
    if (!superConfig || !superConfig.apiKeys || superConfig.apiKeys.length === 0) {
      console.log(`[AI Error] Superadmin Config or API Keys missing.`);
      return { success: false, fallback: true };
    }

    // Round Robin Key Fetch
    const keyIndex = superConfig.currentKeyIndex % superConfig.apiKeys.length;
    const apiKey = superConfig.apiKeys[keyIndex];
    superConfig.currentKeyIndex = (keyIndex + 1) % superConfig.apiKeys.length;
    await superConfig.save();

    // Persona/Context Injection setup from Prisma
    const adminData = await prisma.admin.findUnique({
      where: { id: adminId },
      include: {
        packages: { where: { isActive: true } },
      }
    });

    if (!adminData) {
      return { success: false, fallback: true };
    }

    const packageList = adminData.packages
      .map((p) => `- ${p.name}: Rp${Number(p.price)}/${p.unit} (Estimasi ${p.estimatedDuration} Jam)`)
      .join('\n');

    const dynamicContext = `
[INFORMASI TOKO (HARUS DIGUNAKAN SEBAGAI KONTEKS ABSOLUT/TIDAK BOLEH MENGARANG)]
Nama Toko: ${adminData.storeName}
Alamat: ${adminData.storeAddress || 'Tidak spesifik'}
Kontak Toko: ${adminData.storePhone || 'Tidak spesifik'}
Layanan & Harga Aktif:
${packageList || '(Belum ada daftar layanan, beri tahu pelanggan untuk konsul ke admin manual)'}
`;
    const finalSystemPrompt = `${dynamicContext}\n\n[INSTRUKSI / KEPRIBADIAN BOT]\n${config.aiSystemPrompt}`;

    const res = await queryAiAssistant({
      apiKey,
      provider: superConfig.provider,
      userMessage,
      systemPrompt: finalSystemPrompt
    });

    if (res.success && res.reply) {
      // Increment Quota
      config.aiUsageToday += 1;
      await config.save();
      return { success: true, reply: res.reply };
    }
    
    console.log(`[AI Error] AI response failed:`, res.error);
    return { success: false, fallback: true };

  } catch (err: any) {
    console.error(`[AI Hook Error]`, err.message);
    return { success: false, fallback: true };
  }
}
