FROM node:18.16.1-alpine as build

WORKDIR /tmp/

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.16.1-alpine as phoneBook

WORKDIR /app/

COPY --from=build /tmp/node_modules ./node_modules
COPY --from=build /tmp/package*.json ./
COPY --from=build /tmp/dist ./dist
COPY --from=build /tmp/.env ./.env

RUN apk --no-cache add curl

CMD ["node", "dist/main.js"]
