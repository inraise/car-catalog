FROM ubuntu:latest
LABEL authors="daniilharitonov"

FROM node:18-alpine as builder

WORKDIR /app

COPY . .

RUN npm run install:all
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/package*.json ./

RUN cd backend && npm ci --only=production

ENV NODE_ENV=production
ENV PORT=5063
ENV JWT_SECRET=production_secret_key_change_this
ENV JWT_EXPIRES_IN=7d
ENV BCRYPT_SALT_ROUNDS=12

EXPOSE 3000 5063

CMD ["npm", "start"]

ENTRYPOINT ["top", "-b"]