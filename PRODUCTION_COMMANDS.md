# Commandes production 100vvs

## Local avant push GitHub

```powershell
npm.cmd install
npm.cmd run db:generate
npm.cmd --workspace apps/api run build
npm.cmd --workspace apps/web run build
```

## Backend Render/Railway/Koyeb/Fly

```bash
npm install
npx prisma db push --schema apps/api/prisma/schema.prisma
npm run db:seed
npm --workspace apps/api run build
npm run start:prod
```

## Frontend Netlify depuis la racine du monorepo

```bash
npm install
npm --workspace apps/web run build
```

## Frontend Vercel avec Root Directory apps/web

```bash
npm install
npm run build
```

## Git avec chemin complet Windows si `git` n'est pas dans le PATH

```powershell
& "C:\Program Files\Git\bin\git.exe" init
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Prepare 100vvs production deployment"
& "C:\Program Files\Git\bin\git.exe" branch -M main
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/santoszaki821-debug/100vvs-site.git
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```
