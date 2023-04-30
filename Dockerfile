# pin specific version for stability and use alpine for reduced image size
FROM node:18-alpine AS base

FROM base as production

# set env
ENV NODE_ENV production

WORKDIR /usr/src/app

# copy only files required to install dependencies for better layer caching
COPY package*.json ./

# use cache mount to speed up installation of dependencies
# use npm ci instead of npm install to ensure a reproduceable build.
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci

# use non-root user
USER node

# copy remaining source code after installing dependencies
# use --chown on copy commands to set file permissions
COPY --chown=node:node ./src/ .

EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]