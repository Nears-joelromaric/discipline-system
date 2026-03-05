# Discipline System Universel

Solution logicielle complète de gestion de planning de vie — PWA React + TypeScript.

## Fonctionnalités

- **Import planning** — JSON, CSV, Excel (.xlsx/.xls), Texte (.txt)
- **Alarmes automatiques** — rappel 5 min avant + signal de début
- **Notifications push** natives (Web Notification API)
- **Synthèse vocale française** (Web Speech API)
- **CRUD tâches** avec justification obligatoire
- **Historique complet** de toutes les actions
- **Export données** — JSON et Excel
- **Mode offline** — PWA installable avec Service Worker
- **Dashboard analytics** — graphiques Recharts
- **Déployée sur GitHub Pages**

## Stack technique

| Couche | Technologie |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 + Tailwind CSS v4 |
| State | Zustand |
| DB locale | Dexie (IndexedDB) |
| Import | PapaParse (CSV) + xlsx (Excel) |
| Charts | Recharts |
| Icons | Lucide React |
| PWA | vite-plugin-pwa + Workbox |

## Démarrage rapide

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Import de planning

### Format JSON
```json
{
  "title": "Mon Planning",
  "weeks": [
    {
      "number": 1,
      "title": "Semaine 1 - Fondations",
      "focus": "Mise en place",
      "tasks": [
        {
          "time": "09:00",
          "activity": "Réveil + Sport",
          "duration": 60,
          "type": "sport",
          "points": 10
        }
      ]
    }
  ]
}
```

### Format Texte
```
Semaine 1
06:00 - Réveil + Sport (30min, sport, 5pts)
07:00 - Mémoire (300min, memoire, 50pts)
```

### Format CSV
```
week,date,time,activity,duration,type,points
1,2026-01-01,09:00,Sport,60,sport,10
```

## Types de tâches

| Type | Description |
|---|---|
| `memoire` | Mémoire / thèse |
| `certif` | Certification |
| `anglais` | Anglais |
| `finance` | Finance |
| `sport` | Sport |
| `autre` | Autre |

## Déploiement GitHub Pages

Le workflow GitHub Actions déploie automatiquement sur `gh-pages` à chaque push sur `main`.

URL : `https://<username>.github.io/discipline-system/`
