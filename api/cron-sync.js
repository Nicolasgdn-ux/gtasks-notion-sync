const { syncTasks } = require('../lib/sync');

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await syncTasks();
    return res.status(200).json({
      message: 'Synchronisation réussie',
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur cron:', error);
    return res.status(500).json({
      error: 'Erreur lors de la synchronisation',
      message: error.message,
    });
  }
}
