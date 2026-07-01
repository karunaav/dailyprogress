import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const entries = (await kv.get('entries')) || [];
    return res.status(200).json(entries);
  }

  if (req.method === 'POST') {
    const entry = req.body;
    const entries = (await kv.get('entries')) || [];
    entries.unshift(entry);
    await kv.set('entries', entries);
    return res.status(200).json(entry);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    let entries = (await kv.get('entries')) || [];
    entries = entries.filter((e) => e.id !== id);
    await kv.set('entries', entries);
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
