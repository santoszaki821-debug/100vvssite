# 100vvs

100vvs est une plateforme sociale privee, anonyme sous pseudonyme, avec une identite visuelle blanche, rose pale et rouge profond. Le projet inclut un frontend Next.js, une API NestJS, Prisma/PostgreSQL, Socket.io, Docker et Nginx.

## Fonctionnalites

- Inscription et connexion sans email, uniquement pseudo + mot de passe.
- Mot de passe hashe avec Argon2id, jamais stocke en clair.
- Profils avec avatar, banniere, bio, statut, badges, couleur de pseudo et themes.
- Personnalisation: cadres de messages, style profil, badges visibles, themes Classic, Cyber, Elite, OSINT, Minimal, Premium.
- Chat public temps reel: general, presentations, medias, hors sujet.
- Messages prives, historique, reponses, reactions, edition, suppression, images et GIF.
- Amis: ajout, acceptation, refus, suppression, blocage, deblocage.
- Compte fondateur `100vvs` avec role FOUNDER, badges verifie/fondateur/premium et acces admin.
- Panel admin: utilisateurs, connectes, nouveaux comptes, activite, statistiques et logs.
- Securite: JWT, Argon2id, rate limiting, validation DTO, Prisma contre injection SQL, sanitation anti-XSS, roles et logs.

## Demarrage rapide

1. Copiez l'environnement:

```powershell
Copy-Item .env.example .env
```

2. Modifiez `.env`, surtout `JWT_SECRET`, `POSTGRES_PASSWORD` et `FOUNDER_PASSWORD`.

3. Lancez avec Docker:

```powershell
docker compose up --build
```

4. Ouvrez:

- Web: http://localhost
- API directe: http://localhost:4000/api
- Frontend direct: http://localhost:3000

## Installation locale

```powershell
.\scripts\install.ps1
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

Le compte fondateur est cree par le seed:

- Pseudo: `100vvs`
- Mot de passe: valeur de `FOUNDER_PASSWORD`

## Architecture

```text
apps/api   API NestJS, Prisma, Socket.io
apps/web   Interface Next.js, React, Tailwind, Framer Motion
infra      Configuration Nginx
scripts    Installation locale
```

## Production

Avant production:

- Remplacez tous les secrets `.env`.
- Activez HTTPS au niveau Nginx ou reverse proxy externe.
- Configurez un stockage d'uploads dedie pour images/GIF.
- Ajoutez une retention de logs et une politique de moderation.
- Passez `CORS_ORIGIN` sur le domaine public.
