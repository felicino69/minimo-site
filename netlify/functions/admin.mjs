import { getStore } from '@netlify/blobs';

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async (req) => {
  const adminPassword = req.headers.get('x-admin-password');
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return unauthorized();
  }

  const store = getStore('reel-credentials');

  if (req.method === 'GET') {
    const list = (await store.get('list', { type: 'json' })) || [];
    return json({ list });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const { email, password, note } = body;
    if (!email || !password) {
      return json({ error: 'Email and password are required' }, 400);
    }
    const list = (await store.get('list', { type: 'json' })) || [];
    list.push({ email, password, note: note || '', createdAt: new Date().toISOString() });
    await store.setJSON('list', list);
    return json({ list });
  }

  if (req.method === 'DELETE') {
    const body = await req.json();
    const { email } = body;
    let list = (await store.get('list', { type: 'json' })) || [];
    list = list.filter((entry) => entry.email !== email);
    await store.setJSON('list', list);
    return json({ list });
  }

  return json({ error: 'Method not allowed' }, 405);
};
