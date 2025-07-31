FROM node:20-alpine

MAINTAINER Atul9372

WORKDIR /app

COPY . .

RUN apk update &&\
    npm install &&\
    npm install lucide-react &&\
    npm install -D tailwindcss postcss autoprefixer

EXPOSE 3000

CMD [ "npm", "run", "dev" ]