import { json } from 'micro';

let wallets = [];

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === 'POST') {
      const body = await json(req);
      const { userId, balance = 0, currency = 'USD', paymentMethod = 'PayPal' } = body;

      if (typeof userId !== 'string') {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid data. userId must be a string.' }));
      }

      const wallet = {
        id: Date.now().toString(),
        userId,
        balance: typeof balance === 'number' ? balance : 0,
        currency,
        paymentMethod,
        lastUpdated: new Date().toISOString()
      };

      wallets.push(wallet);

      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'Wallet created', wallet }));
    }

    if (method === 'GET') {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing or invalid userId in query' }));
      }

      const userWallets = wallets.filter((w) => w.userId === userId);
      res.statusCode = 200;
      return res.end(JSON.stringify(userWallets));
    }

    if (method === 'PUT') {
      const body = await json(req);
      const { id, balance, paymentMethod } = body;

      const index = wallets.findIndex((w) => w.id === id);

      if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Wallet not found' }));
      }

      if (typeof balance === 'number') {
        wallets[index].balance = balance;
      }

      if (typeof paymentMethod === 'string') {
        wallets[index].paymentMethod = paymentMethod;
      }

      wallets[index].lastUpdated = new Date().toISOString();

      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Wallet updated', wallet: wallets[index] }));
    }

    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (error) {
    console.error('Wallet API error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
