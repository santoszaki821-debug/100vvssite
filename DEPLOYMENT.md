# Deploiement production 100vvs

Ce projet ne doit pas etre deploye uniquement sur GitHub Pages, car il contient:

- un frontend Next.js;
- un backend NestJS;
- une base PostgreSQL;
- Socket.io pour le temps reel.

Architecture conseillee:

- GitHub: stockage du code.
- Frontend: Netlify ou Vercel.
- Backend API: Render, Railway, Koyeb ou Fly.io.
- Database: Neon, Supabase Postgres ou Railway PostgreSQL.

## 1. Base PostgreSQL en ligne

Cree une base PostgreSQL sur Neon, Supabase ou Railway.

Recupere:

- `DATABASE_URL`
- `DIRECT_URL` si disponible

Avec Neon, utilise generalement:

- `DATABASE_URL`: URL pooled / pooler, pour l'application NestJS en runtime.
- `DIRECT_URL`: URL directe, pour Prisma `db push`, migrations et operations schema.

Si ton hebergeur ne donne qu'une seule URL, mets la meme valeur dans `DATABASE_URL` et `DIRECT_URL`.

Exemple:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler:5432/DB?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require
```

La base locale `127.0.0.1` ne doit jamais etre utilisee en production.

## 2. Backend NestJS

Heberge l'API sur Render, Railway, Koyeb ou Fly.io.

Variables d'environnement backend:

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
npm run db:generate
npx prisma db push --schema apps/api/prisma/schema.prisma
npm run db:seed
npm --workspace apps/api run build
npm run start:prod
```

Sur Render, tu peux utiliser:

```text
Build command:
npm install && npm --workspace apps/api run build

Start command:
npm --workspace apps/api run start:prod
```

Puis lance une fois dans le shell de l'hebergeur:

```bash
npx prisma db push --schema apps/api/prisma/schema.prisma
npm run db:seed
```

## 3. Frontend

Netlify ou Vercel est recommande.

Variables d'environnement frontend:

```text
NEXT_PUBLIC_API_URL=https://ton-api.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://ton-api.onrender.com
```

Si tu deploies depuis le monorepo:

- base/repository root: racine du repo;
- package/site directory: `apps/web`;
- build command: `npm run build`;
- publish directory: `.next`.

Si tu utilises le dossier separe `100vvs-netlify`, importe directement ce dossier.

## 4. CORS

Le backend accepte plusieurs origines separees par virgule:

```text
CORS_ORIGIN=https://ton-site.netlify.app,https://ton-site.vercel.app,http://localhost:3000
```

En production, mets au minimum l'URL publique du frontend.

## 5. GitHub

Depuis le dossier `100vvs`:

```bash
git init
git add .
git commit -m "Initial production-ready 100vvs"
git branch -M main
git remote add origin https://github.com/TON_USER/100vvs.git
git push -u origin main
```

Ne commit jamais `.env`. Utilise les variables d'environnement dans les dashboards Netlify/Render/Railway/etc.

## 6. Verification

Apres deploiement:

1. Ouvre l'URL API: `https://ton-api.../api/messages/channels`.
   - Sans token, un `401` peut etre normal sur certaines routes.
2. Ouvre le frontend.
3. Verifie que `NEXT_PUBLIC_API_URL` ne pointe pas vers `localhost`.
4. Connecte-toi avec le compte fondateur cree par `npm run db:seed`.
5. Envoie un message dans General.

Si le navigateur affiche `Failed to fetch`, verifie presque toujours:

- API non deployee ou endormie;
- mauvais `NEXT_PUBLIC_API_URL`;
- CORS_ORIGIN absent ou incorrect;
- API en HTTP au lieu de HTTPS;
- base PostgreSQL locale encore utilisee en production.
