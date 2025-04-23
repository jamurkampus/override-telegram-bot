import type { NextApiRequest, NextApiResponse } from 'next';
import vault from '../data/override-vault.json'; // Pastikan file JSON ada di folder ini

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.query as string || "").toLowerCase();

  // Cari jawaban yang cocok dengan trigger
  const match = vault.find(entry => query.includes(entry.trigger.toLowerCase()));

  if (match) {
    res.status(200).json({ response: match.response });
  } else {
    res.status(200).json({ response: null });
  }
}
