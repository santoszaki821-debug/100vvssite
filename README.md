# 100vvs

100vvs est une plateforme communautaire privee sous pseudonyme.

Le projet fonctionne en local et il est prepare pour une mise en production avec:

- GitHub pour le code
- Frontend Next.js sur Netlify ou Vercel
- Backend NestJS sur Render, Railway, Koyeb ou Fly.io
- Base PostgreSQL en ligne sur Neon, Supabase ou Railway PostgreSQL

## Ce qui a deja ete fait

- Frontend Next.js / React / TypeScript / Tailwind / Framer Motion.
- Backend NestJS / Node.js.
- Base PostgreSQL avec Prisma.
- Authentification sans email: pseudo + mot de passe.
- Hash mot de passe avec Argon2id.
- JWT, roles, guards et CORS multi-domaines.
- Chat public avec Socket.io.
- Salons: General, Presentations, Medias, Hors sujet.
- Profils: avatar, banniere, bio, statut, couleur du pseudo, theme, badges.
- Systemes d'amis: ajouter, accepter, refuser, supprimer, bloquer, debloquer.
- Panel admin/fondateur.
- Compte fondateur `100vvs`.
- Identite visuelle refaite en noir mat + violet neon.
- Page Accueil avec stats, activite, membres en ligne, evenements et classements.
- Page Jeux avec XP dynamique, streak, victoires, mini-jeux, succes et historique.
- Page Roues avec Culture G, Action/Verite, roues live et questions custom.
- Correction du bug `Failed to fetch` local lie a l'API/CORS.
- Correction du bug d'envoi de message general.
- Preparation production:
  - `.env.production.example`
  - `DEPLOYMENT.md`
  - `PRODUCTION_COMMANDS.md`
  - `render.yaml`
  - `netlify.toml`
  - `vercel.json`
- Push GitHub effectue sur:
  - https://github.com/santoszaki821-debug/100vvssite

## Architecture

```text
apps/api     Backend NestJS, Prisma, Socket.io
apps/web     Frontend Next.js, React, Tailwind, Framer Motion
infra        Configuration Nginx
scripts      Scripts d'installation locale
```

## Lancer en local

Depuis le dossier du projet:

```powershell
cd "C:\Users\userd\Documents\Nouveau dossier\100vvs"
npm.cmd install
```

Configure `.env` pour la base locale.

Exemple local:

```text
DATABASE_URL=postgresql://100vvs:100vvs@127.0.0.1:5432/100vvs?schema=public
DIRECT_URL=postgresql://100vvs:100vvs@127.0.0.1:5432/100vvs?schema=public
JWT_SECRET=change-this-local-secret
JWT_EXPIRES_IN=7d
FOUNDER_PASSWORD=VVS-Fonda-2026!
API_PORT=4000
WEB_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

Puis:

```powershell
npm.cmd run db:generate
npm.cmd run db:push
npm.cmd run db:seed
npm.cmd run dev
```

URLs locales:

```text
Frontend: http://127.0.0.1:3000
API:      http://127.0.0.1:4000/api
```

Compte fondateur local:

```text
Pseudo: 100vvs
Mot de passe: valeur de FOUNDER_PASSWORD
```

## Verifier avant deploy

```powershell
npm.cmd run db:generate
npm.cmd --workspace apps/api run build
npm.cmd --workspace apps/web run build
```

Ces verifications ont deja ete faites avec succes.

## Mettre a jour GitHub

Git n'est pas dans le PATH sur cette machine, donc utilise le chemin complet:

```powershell
& "C:\Program Files\Git\bin\git.exe" status
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Update 100vvs"
& "C:\Program Files\Git\bin\git.exe" push
```

Le remote actuel est:

```text
https://github.com/santoszaki821-debug/100vvssite.git
```

## Deploiement production

Important: GitHub Pages ne suffit pas pour tout le projet.

Pourquoi:

- GitHub Pages ne lance pas NestJS.
- GitHub Pages ne fournit pas PostgreSQL.
- Le chat temps reel et l'API doivent tourner sur un vrai backend.

Architecture conseillee:

```text
GitHub       -> code
Netlify/Vercel -> frontend Next.js
Render/Railway/Koyeb/Fly -> backend NestJS
Neon/Supabase/Railway PostgreSQL -> database
```

## 1. Creer la database en ligne

Utilise Neon, Supabase ou Railway PostgreSQL.

Tu dois obtenir:

```text
DATABASE_URL
DIRECT_URL
```

Avec Neon:

- `DATABASE_URL` peut etre l'URL pooled/pooler pour l'application.
- `DIRECT_URL` doit etre l'URL directe pour Prisma schema operations.

Si ton fournisseur donne une seule URL, mets la meme valeur dans `DATABASE_URL` et `DIRECT_URL`.

La base locale `127.0.0.1` ne doit jamais etre utilisee en production.

## 2. Deployer le backend

Sur Render/Railway/Koyeb/Fly, configure les variables:

```text
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=un-secret-long-et-aleatoire
JWT_EXPIRES_IN=7d
FOUNDER_PASSWORD=mot-de-passe-fondateur
CORS_ORIGIN=https://ton-site.netlify.app
```

Commandes backend:

```bash
npm install
npx prisma db push --schema apps/api/prisma/schema.prisma
npm run db:seed
npm --workspace apps/api run build
npm run start:prod
```

Sur Render:

```text
Build command:
npm install && npm --workspace apps/api run build

Start command:
npm --workspace apps/api run start:prod
```

Le fichier `render.yaml` est deja prepare.

## 3. Deployer le frontend

Sur Netlify ou Vercel, configure:

```text
NEXT_PUBLIC_API_URL=https://ton-api.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://ton-api.onrender.com
```

Pour Netlify:

```text
Build command: npm install && npm --workspace apps/web run build
Publish directory: apps/web/.next
```

Le fichier `netlify.toml` est deja prepare.

Pour Vercel:

```text
Root Directory: apps/web
Install Command: npm install
Build Command: npm run build
```

Le fichier `apps/web/vercel.json` est deja prepare pour ne pas relancer de commande workspace.

## Si tu vois `Failed to fetch`

Ca veut presque toujours dire que le frontend ne trouve pas l'API.

Verifie:

- `NEXT_PUBLIC_API_URL` ne doit pas etre `localhost` en production.
- `NEXT_PUBLIC_SOCKET_URL` ne doit pas etre `localhost` en production.
- L'API Render/Railway/Koyeb/Fly doit etre en ligne.
- `CORS_ORIGIN` doit contenir l'URL publique du frontend.
- L'API doit utiliser la database en ligne, pas PostgreSQL local.

## Prochaine chose a faire

1. Creer une base PostgreSQL en ligne.
2. Recuperer `DATABASE_URL` et `DIRECT_URL`.
3. Creer le backend sur Render/Railway/Koyeb/Fly.
4. Mettre les variables backend.
5. Lancer `npx prisma db push` puis `npm run db:seed`.
6. Deployer le frontend sur Netlify/Vercel.
7. Mettre `NEXT_PUBLIC_API_URL` et `NEXT_PUBLIC_SOCKET_URL`.
