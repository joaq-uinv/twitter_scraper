FROM public.ecr.aws/lambda/nodejs:16

# Set the working directory
WORKDIR /var/task

# Copy the entire project
COPY . .

# Install dependencies
RUN npm install

# Set the entrypoint to the Lambda runtime
ENTRYPOINT [ "/lambda-entrypoint.sh" ]

# Set the handler command
CMD [ "app.handler" ]