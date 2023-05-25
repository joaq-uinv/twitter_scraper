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

# # use non-root user
# USER node

# # set custom UID and GID values
# ARG USER_ID=1000
# ARG GROUP_ID=1000

# # update ownership of the home directory
# RUN sudo chown -R $USER_ID:$GROUP_ID /home/node

WORKDIR ${LAMBDA_TASK_ROOT}

# copy from the previous stage
COPY --from=builder /usr/src/app/ .

# EXPOSE 5000

ENTRYPOINT [ "npm", "start" ]