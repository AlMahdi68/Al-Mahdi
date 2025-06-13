import { json } from 'micro';

let withdrawalRequests = [];

export default async function handler(req, res) {
  try {
    const method = req.method;

    if (method === 'POST') {
      const body = await json(req);
      const { userId, amount, method = 'PayPal', currency = 'USD' } = body;

      if (
        typeof userId !== 'string' ||
        typeof amount !== 'number' ||
        amount <= 0
      ) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid withdrawal request. Required: userId (string), amount (number > 0).' }));
      }

      const request = {
        id: Date.now().toString(),
        userId,
        amount,
        method,
        currency,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      withdrawalRequests.push(request);

      res.statusCode = 201;
      return res.end(JSON.stringify({ message: 'Withdrawal request submitted', request }));
    }

    if (method === 'GET') {
      const { userId, status } = req.query;

      let results = withdrawalRequests;

      if (userId) {
        results = results.filter((w) => w.userId === userId);
      }

      if (status) {
        results = results.filter((w) => w.status === status);
      }

      res.statusCode = 200;
      return res.end(JSON.stringify(results));
    }

    if (method === 'PUT') {
      const body = await json(req);
      const { id, status } = body;

      if (!id || !['approved', 'rejected', 'paid'].includes(status)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Valid id and status (approved | rejected | paid) are required.' }));
      }

      const index = withdrawalRequests.findIndex((w) => w.id === id);
      if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Withdrawal request not found.' }));
      }

      withdrawalRequests[index].status = status;
      withdrawalRequests[index].updatedAt = new Date().toISOString();

      res.statusCode = 200;
      return res.end(JSON.stringify({ message: 'Status updated', request: withdrawalRequests[index] }));
    }

    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: `Method ${method} Not Allowed` }));
  } catch (error) {
    console.error('Withdraw API error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
