FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package.json
RUN npm install --workspace apps/api --include-workspace-root

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm --workspace apps/api run prisma:generate
RUN npm --workspace apps/api run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json
EXPOSE 4000
CMD ["node", "dist/main.js"]
