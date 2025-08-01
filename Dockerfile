FROM node:20-alpine AS build

LABEL MAINTAINER="Atul9372"

WORKDIR /app

COPY . .

RUN apk update &&\
    npm install &&\
    npm install lucide-react &&\
    npm install -D tailwindcss postcss autoprefixer

FROM node:20-alpine

WORKDIR /app
COPY --from=build /app .

EXPOSE 3000
CMD [ "npm", "run", "dev" ]