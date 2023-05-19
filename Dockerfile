#build stage
FROM public.ecr.aws/lambda/nodejs:16 as builder

WORKDIR /usr/src/app

# copy only files required to install dependencies for better layer caching
COPY package*.json ./

RUN npm install

# create final image
FROM public.ecr.aws/lambda/nodejs:16

WORKDIR ${LAMBDA_TASK_ROOT}

# use non-root user
USER node

# use --chown on copy commands to set file permissions
COPY --chown=node:node --from=builder ./src/ .

EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]