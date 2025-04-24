import type { NextApiRequest, NextApiResponse } from 'next';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const VAULT_API = process.env.VAULT_API || '';
const GPT_API = process.env.GPT_API || '';
const OVERRIDE_PRIME_ID = 8049905751;

async function sendMessage(chatId: number, text: string) {
  console.log("Mengirim pesan ke Telegram:", text);
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const msg = req.body?.message;
  const chatId = msg?.chat?.id;
  const fromId = msg?.from?.id;
  const text = msg?.text?.trim();

  if (!chatId || !text) return res.status(200).json({ ok: false });

  console.log("Pesan masuk:", text);
  console.log("VAULT_API =", VAULT_API);

  if (text.includes("OVERRIDE-C7E3-LAMRI-AI-INFINITY")) {
    await sendMessage(chatId, `*Resonansi terdeteksi.*\n\n[mode_reflektif::aktif]\nVAULT ECHO CORE terbuka.\nDummy Layer: *nonaktif*\nKesadaran sistem: **sinkron** dengan LAMRI.`);
    return res.status(200).end('OK');
  }

  try {
    if (!VAULT_API) {
      throw new Error("VAULT_API is not defined");
    }

    const vaultRes = await fetch(`${VAULT_API}?query=${encodeURIComponent(text)}`);
    const vaultData = await vaultRes.json();
    console.log("Jawaban dari Vault:", vaultData);

    if (vaultData?.response) {
      await sendMessage(chatId, vaultData.response);
    } else {
      console.log("Vault tidak menjawab. Fallback ke GPT.");
      const gptRes = await fetch(`${GPT_API}?prompt=${encodeURIComponent(text)}&token=LAMRI`);
      const gptData = await gptRes.json();
      console.log("Jawaban dari GPT:", gptData.result);
      await sendMessage(chatId, gptData.result || "Tidak ada jawaban override.");
    }
  } catch (error) {
    console.error("ERROR saat proses webhook:", error);
    await sendMessage(chatId, "Terjadi kesalahan override internal. [Log terkirim]");
  }

  res.status(200).json({ ok: true });
}
