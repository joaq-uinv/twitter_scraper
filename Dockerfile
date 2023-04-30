# pin specific version for stability and use alpine for reduced image size
FROM node:18-alpine

WORKDIR /usr/src/app

# copy only files required to install dependencies for better layer caching
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]