import { json } from 'micro';

let revenueData = [];

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === 'POST') {
      const body = await json(req);
      const { userId, amount, source, currency = 'USD' } = body;

      if (
        typeof userId !== 'string' ||
        typeof amount !== 'number' ||
        typeof source !== 'string'
      ) {
        res.statusCode = 400;
        return res.end(JSON.stringify({
          error: 'Invalid data. Required: userId (string), amount (number), source (string), optional currency (string).'
        }));
      }

      const entry = {
        id: Date.now().toString(),
        userId,
        amount,
        source,
        currency,
        timestamp: new Date().toISOString()
      };

      revenueData.push(entry);

      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'Revenue recorded', revenue: entry }));
    }

    if (method === 'GET') {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing or invalid userId in query' }));
      }

      const userRevenue = revenueData.filter((r) => r.userId === userId);
      res.statusCode = 200;
      return res.end(JSON.stringify(userRevenue));
    }

    res.setHeader('Allow', ['POST', 'GET']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (error) {
    console.error('Revenue API error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
