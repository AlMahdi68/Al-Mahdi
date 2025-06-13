import { json } from 'micro';

let conversions = [];

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === 'POST') {
      const body = await json(req);
      const { userId, leadId, revenue } = body;

      if (
        typeof userId !== 'string' ||
        typeof leadId !== 'string' ||
        typeof revenue !== 'number'
      ) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid data. Required: userId (string), leadId (string), revenue (number).' }));
      }

      const newConversion = {
        id: Date.now().toString(),
        userId,
        leadId,
        revenue,
        createdAt: new Date().toISOString()
      };

      conversions.push(newConversion);
      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'Conversion recorded', conversion: newConversion }));
    }

    if (method === 'GET') {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing or invalid userId in query' }));
      }

      const userConversions = conversions.filter((conv) => conv.userId === userId);
      res.statusCode = 200;
      return res.end(JSON.stringify(userConversions));
    }

    res.setHeader('Allow', ['POST', 'GET']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (error) {
    console.error('Conversions API error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
