FROM node:18-alpine AS build

RUN mkdir /work
WORKDIR /work

COPY . .
RUN npm install
RUN npm run build


FROM node:18-alpine

RUN mkdir /app
WORKDIR /app

COPY --from=build /work .

ENTRYPOINT ["node", "build/index.js"]
