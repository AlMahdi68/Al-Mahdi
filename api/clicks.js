import { json } from 'micro';

let clicks = [];

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === 'POST') {
      const body = await json(req);
      const { userId, linkId, platform } = body;

      if (
        typeof userId !== 'string' ||
        typeof linkId !== 'string' ||
        typeof platform !== 'string'
      ) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid click data. Required: userId, linkId, platform (all strings).' }));
      }

      const newClick = {
        id: Date.now().toString(),
        userId,
        linkId,
        platform,
        timestamp: new Date().toISOString()
      };

      clicks.push(newClick);
      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'Click recorded', click: newClick }));
    }

    if (method === 'GET') {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing or invalid userId in query' }));
      }

      const userClicks = clicks.filter((click) => click.userId === userId);
      res.statusCode = 200;
      return res.end(JSON.stringify(userClicks));
    }

    res.setHeader('Allow', ['POST', 'GET']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (error) {
    console.error('Clicks API error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
