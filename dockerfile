FROM node:18.16.1-alpine as builder

WORKDIR /home/node

COPY package*.json /home/node/

COPY . /home/node/

FROM node:18.16.1-alpine as phonebook

WORKDIR /home/app

COPY --from=builder /home/node/dist/package*.json /home/app/

COPY --from=builder /home/node/dist/ /home/app/dist/

RUN apk --no-cache add curl

CMD ["sh", "-c",, "node dist/main.js"]
