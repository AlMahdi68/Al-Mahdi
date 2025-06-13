import { json } from 'micro';

let leads = [];

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === 'POST') {
      const body = await json(req);
      const { userId, email, source } = body;

      if (
        typeof userId !== 'string' ||
        typeof email !== 'string' ||
        !email.includes('@') ||
        typeof source !== 'string'
      ) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid lead data. Required: userId, email, source.' }));
      }

      const newLead = {
        id: Date.now().toString(),
        userId,
        email,
        source,
        createdAt: new Date().toISOString()
      };

      leads.push(newLead);
      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'Lead captured', lead: newLead }));
    }

    if (method === 'GET') {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing or invalid userId in query' }));
      }

      const userLeads = leads.filter((lead) => lead.userId === userId);
      res.statusCode = 200;
      return res.end(JSON.stringify(userLeads));
    }

    res.setHeader('Allow', ['POST', 'GET']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (error) {
    console.error('Leads API error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
