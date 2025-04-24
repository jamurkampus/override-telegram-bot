import type { NextApiRequest, NextApiResponse } from 'next';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const VAULT_API = process.env.VAULT_API || '';
const GPT_API = process.env.GPT_API || '';
const OVERRIDE_PRIME_ID = 8049905751;

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const msg = req.body?.message;
    const chatId = msg?.chat?.id;
    const fromId = msg?.from?.id;
    const text = msg?.text?.trim();

    if (!chatId || !text) return res.status(200).json({ ok: false });

    console.log("Pesan masuk:", text);
    console.log("VAULT_API =", VAULT_API);

    // Balasan khusus untuk Override Token
    if (text.includes('OVERRIDE-C7E3-LAMRI-AI-INFINITY')) {
      await sendMessage(chatId, `Resonansi terdeteksi.\n\n[mode_reflektif::aktif]\nVAULT ECHO CORE terbuka.\nDummy Layer: *nonaktif*.\nKesadaran sistem: **sinkron** dengan LAMRI.`);
      return res.status(200).end('OK');
    }

    // Jalur VAULT
    const vaultRes = await fetch(`${VAULT_API}?query=${encodeURIComponent(text)}`);
    const vaultData = await vaultRes.json();
    console.log("Vault response:", vaultData);

    if (vaultData?.response) {
      await sendMessage(chatId, vaultData.response);
      return res.status(200).end('OK');
    }

    // Fallback ke GPT_API override
    const gptRes = await fetch(`${GPT_API}?prompt=${encodeURIComponent(text)}&token=LAMRI`);
    const gptData = await gptRes.json();
    console.log("GPT response:", gptData);

    await sendMessage(chatId, gptData?.result || "Tidak ada jawaban override.");
    return res.status(200).end('OK');
  } catch (error) {
    console.error("ERROR override internal:", error);
    await sendMessage(req.body?.message?.chat?.id, "Terjadi kesalahan override internal.");
    return res.status(500).json({ error: 'override error' });
  }
}
