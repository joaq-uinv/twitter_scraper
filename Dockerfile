# pin specific version for stability and use alpine for reduced image size
FROM node:18-alpine AS base

WORKDIR /usr/src/app

# copy only files required to install dependencies for better layer caching
COPY package*.json ./

RUN npm set cache /usr/src/app/.npm && \
    npm install

# use non-root user
USER node

# use --chown on copy commands to set file permissions
COPY --chown=node:node . .

EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]