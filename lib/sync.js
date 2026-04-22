const { google } = require('googleapis');
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getGoogleTasksClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost'
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.tasks({ version: 'v1', auth });
}

async function getTasks() {
  try {
    const tasks = await getGoogleTasksClient();
    const res = await tasks.tasklists.list();
    const taskListId = res.data.items?.[0]?.id;

    if (!taskListId) {
      console.log('Aucune liste de tâches trouvée');
      return [];
    }

    const taskRes = await tasks.tasks.list({
      tasklist: taskListId,
    });

    return taskRes.data.items || [];
  } catch (error) {
    console.error('Erreur en récupérant les tâches Google:', error);
    throw error;
  }
}

async function createNotionPage(task) {
  try {
    const dueDate = task.due ? task.due.split('T')[0] : null;

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        'Tâche': {
          title: [{ text: { content: task.title } }],
        },
        'Statut': {
          status: {
            name: task.status === 'completed' ? 'Terminé' : 'À faire',
          },
        },
        ...(dueDate && {
          'Date d\'échéance': {
            date: { start: dueDate },
          },
        }),
      },
      children:
        task.notes ?
          [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                text: [{ text: { content: task.notes } }],
              },
            },
          ]
          : [],
    });

    console.log(`✅ Page créée: ${task.title}`);
  } catch (error) {
    console.error(`Erreur en créant page pour ${task.title}:`, error);
  }
}

async function syncTasks() {
  console.log('🔄 Synchronisation des tâches...');

  try {
    const googleTasks = await getTasks();
    console.log(`📋 ${googleTasks.length} tâches trouvées dans Google Tasks`);

    for (const task of googleTasks) {
      await createNotionPage(task);
    }

    console.log('✅ Synchronisation complète!');
    return { success: true, count: googleTasks.length };
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    throw error;
  }
}

module.exports = { syncTasks };
