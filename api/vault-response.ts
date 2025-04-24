import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.query || '').toString().toLowerCase();

  try {
    const filePath = path.join(process.cwd(), 'data', 'override-vault.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const vault = JSON.parse(fileContents);

    const match = vault.find((entry: any) =>
      query.includes(entry.trigger.toLowerCase())
    );

    if (match) {
      return res.status(200).json({ response: match.response });
    } else {
      return res.status(200).json({ response: null });
    }
  } catch (error) {
    console.error('Vault error:', error);
    return res.status(500).json({ error: 'Vault internal error' });
  }
}
