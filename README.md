# Google Tasks → Notion Sync

Synchronise automatiquement vos tâches Google Tasks vers Notion chaque jour à 9h du matin.

## Setup

### 1. Variables d'environnement

Copie `.env.example` en `.env.local` et remplis les valeurs:

```bash
cp .env.example .env.local
```

**Google Tasks:**
- `GOOGLE_CLIENT_ID` - De Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - De Google Cloud Console
- `GOOGLE_REFRESH_TOKEN` - Généré après l'authentification OAuth

**Notion:**
- `NOTION_API_KEY` - De https://www.notion.so/my-integrations
- `NOTION_DATABASE_ID` - L'ID de ta database Notion

### 2. Installation

```bash
npm install
```

### 3. Déploiement sur Vercel

```bash
npm install -g vercel
vercel
```

Ajoute les variables d'environnement dans le dashboard Vercel après le déploiement.

## Comment ça marche

- **Cron job:** S'exécute chaque jour à 9h (UTC)
- **Synchronisation:** Récupère toutes les tâches Google Tasks
- **Création:** Ajoute les nouvelles tâches dans Notion
- **Statut:** Synchronise le statut (À faire / Terminé)
- **Notes:** Inclut les notes comme contenu de la page

## Configuration du cron

Édite `vercel.json` pour changer l'heure:
- `0 9 * * *` = 9h du matin tous les jours (UTC)
- `0 8 * * *` = 8h du matin
- `30 14 * * *` = 14h30

Format: `minute heure jour mois jour_semaine`

## Développement local

```bash
vercel dev
```

Puis visite `http://localhost:3000/api/cron-sync` pour tester manuellement.
