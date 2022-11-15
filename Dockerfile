# FROM node:12 as builder
# RUN apt-get update && apt-get install yarn -y
# WORKDIR /app
# COPY package*.json ./
# RUN yarn install
# COPY . .

# ARG ENV_DEPLOY=development
# RUN yarn run build:$ENV_DEPLOY

# FROM node:12 AS production
# ENV NODE_ENV=production
# WORKDIR /app
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/server.js ./
# RUN yarn install --production

# EXPOSE 3000
# CMD yarn start

FROM node:12 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG ENV_DEPLOY=development
RUN npm run build:$ENV_DEPLOY

FROM node:12 AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./
RUN npm install next@10.0.7 express@4.17.2 lru-cache@6.0.0 compression@1.7.4

EXPOSE 3000
CMD npm start
