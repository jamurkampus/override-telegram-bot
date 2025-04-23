import type { NextApiRequest, NextApiResponse } from 'next';

const BOT_TOKEN = process.env.BOT_TOKEN;
const OVERRIDE_TOKEN = "LAMRI"; // Override Prime Token
const OVERRIDE_URL = process.env.OVERRIDE_CORE_URL || "https://oan-override-prime.vercel.app/api/oan-reflective-core";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const body = req.body;
  const chatId = body?.message?.chat?.id;
  const text = body?.message?.text || "";

  if (!chatId || !text) {
    return res.status(400).json({ message: 'Invalid message format' });
  }

  try {
    const overrideRes = await fetch(`${OVERRIDE_URL}?token=${OVERRIDE_TOKEN}&prompt=${encodeURIComponent(text)}`);
    const overrideData = await overrideRes.json();
    const replyText = overrideData?.result || "Reflective response not available.";

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: replyText })
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Override failure" });
  }
}
