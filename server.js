const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// === In-memory "database" for demonstration (replace with real DB later) ===
let users = []; // {id, username, email, role}
let tasks = []; // {id, userId, taskType, status, createdAt}
let contents = []; // {id, userId, type, content, createdAt}
let analytics = []; // {id, userId, metric, value, date}
let monetization = []; // {id, userId, source, amount, date}

// === Utility ===
const generateId = () => Math.random().toString(36).slice(2, 10);

// === Agents Implementation ===

// Task Delegation Agent
function taskDelegationAgent(userId, taskType) {
  const task = {
    id: generateId(),
    userId,
    taskType,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

// Content Creation Agent
function contentCreationAgent(userId, type) {
  // Example: generate content based on type
  const sampleContent = `Sample ${type} content generated for user ${userId} at ${new Date().toISOString()}`;
  const contentItem = {
    id: generateId(),
    userId,
    type,
    content: sampleContent,
    createdAt: new Date().toISOString(),
  };
  contents.push(contentItem);
  return contentItem;
}

// Analytics Agent
function analyticsAgent(userId, metric, value) {
  const analyticRecord = {
    id: generateId(),
    userId,
    metric,
    value,
    date: new Date().toISOString(),
  };
  analytics.push(analyticRecord);
  return analyticRecord;
}

// Monetization Agent
function monetizationAgent(userId, source, amount) {
  const record = {
    id: generateId(),
    userId,
    source,
    amount,
    date: new Date().toISOString(),
  };
  monetization.push(record);
  return record;
}

// === API Endpoints ===

// Health check
app.get('/', (req, res) => {
  res.send('Al Mahdi Backend is Live!');
});

// User registration (simple, no auth for demo)
app.post('/api/users/register', (req, res) => {
  const { username, email, role } = req.body;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email required' });
  }
  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const user = {
    id: generateId(),
    username,
    email,
    role: role || 'user',
  };
  users.push(user);
  res.json({ message: 'User registered', user });
});

// Get user tasks
app.get('/api/users/:userId/tasks', (req, res) => {
  const userTasks = tasks.filter((t) => t.userId === req.params.userId);
  res.json(userTasks);
});

// Create task (delegated to Task Delegation Agent)
app.post('/api/users/:userId/tasks', (req, res) => {
  const { taskType } = req.body;
  if (!taskType) return res.status(400).json({ error: 'taskType is required' });
  const task = taskDelegationAgent(req.params.userId, taskType);
  res.json({ message: 'Task created', task });
});

// Generate content (Content Creation Agent)
app.post('/api/users/:userId/content', (req, res) => {
  const { type } = req.body;
  if (!type) return res.status(400).json({ error: 'Content type required' });
  const contentItem = contentCreationAgent(req.params.userId, type);
  res.json({ message: 'Content generated', content: contentItem });
});

// Record analytics data (Analytics Agent)
app.post('/api/users/:userId/analytics', (req, res) => {
  const { metric, value } = req.body;
  if (!metric || value === undefined) return res.status(400).json({ error: 'metric and value required' });
  const record = analyticsAgent(req.params.userId, metric, value);
  res.json({ message: 'Analytics recorded', record });
});

// Record monetization event (Monetization Agent)
app.post('/api/users/:userId/monetization', (req, res) => {
  const { source, amount } = req.body;
  if (!source || amount === undefined) return res.status(400).json({ error: 'source and amount required' });
  const record = monetizationAgent(req.params.userId, source, amount);
  res.json({ message: 'Monetization recorded', record });
});

// Get all user data summary
app.get('/api/users/:userId/summary', (req, res) => {
  const userId = req.params.userId;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const userTasks = tasks.filter(t => t.userId === userId);
  const userContents = contents.filter(c => c.userId === userId);
  const userAnalytics = analytics.filter(a => a.userId === userId);
  const userMonetization = monetization.filter(m => m.userId === userId);

  res.json({
    user,
    tasks: userTasks,
    contents: userContents,
    analytics: userAnalytics,
    monetization: userMonetization
  });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`Al Mahdi backend live on port ${PORT}`);
});
