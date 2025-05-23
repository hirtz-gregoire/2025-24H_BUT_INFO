FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18 AS api
WORKDIR /api
COPY api/package*.json ./
RUN apt-get update && apt-get install -y openssl
RUN npm install
COPY api .
RUN npx prisma generate
EXPOSE 4000
CMD ["node", "server.js"]

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
