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
