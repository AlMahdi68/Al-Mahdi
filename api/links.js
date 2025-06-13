import { json } from 'micro';

let links = [];

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === 'POST') {
      const body = await json(req);
      const { userId, url, title, platform } = body;

      if (
        typeof userId !== 'string' ||
        typeof url !== 'string' ||
        typeof title !== 'string' ||
        typeof platform !== 'string'
      ) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid data. Required: userId, url, title, platform (all strings).' }));
      }

      const newLink = {
        id: Date.now().toString(),
        userId,
        url,
        title,
        platform,
        createdAt: new Date().toISOString()
      };

      links.push(newLink);
      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'Link added', link: newLink }));
    }

    if (method === 'GET') {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing or invalid userId in query' }));
      }

      const userLinks = links.filter((link) => link.userId === userId);
      res.statusCode = 200;
      return res.end(JSON.stringify(userLinks));
    }

    if (method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing link id in query' }));
      }

      const before = links.length;
      links = links.filter((link) => link.id !== id);

      if (links.length === before) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Link not found' }));
      }

      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Link deleted' }));
    }

    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (error) {
    console.error('Links API error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
