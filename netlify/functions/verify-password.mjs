import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ valid: false, error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid request' }), { status: 400 });
  }

  const password = body.password;
  if (!password) {
    return new Response(JSON.stringify({ valid: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const store = getStore('reel-credentials');
  const list = (await store.get('list', { type: 'json' })) || [];
  const valid = list.some((entry) => entry.password === password);

  return new Response(JSON.stringify({ valid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
