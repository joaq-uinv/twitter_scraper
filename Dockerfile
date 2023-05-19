#build stage
FROM public.ecr.aws/lambda/nodejs:16 as builder

WORKDIR /usr/src/app

# copy only files required to install dependencies for better layer caching
COPY package*.json ./

RUN npm install

# copy the source code
COPY ./src .

# create final image
FROM public.ecr.aws/lambda/nodejs:16

WORKDIR ${LAMBDA_TASK_ROOT}

# use non-root user
# create a custom user with UID and GID
RUN addgroup -S node && adduser -S -G node node
USER node


# use --chown on copy commands to set file permissions
COPY --chown=node:node --from=builder /usr/src/app/ .

EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]