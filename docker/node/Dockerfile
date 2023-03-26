FROM node:19-alpine3.16
USER node

# Set the working directory to /app
WORKDIR /app
RUN chmod -R 777 ./


COPY node/package.json .
COPY node/package-lock.json .

RUN npm i

# Install dependencies
#RUN npm install


# Start the application
#CMD ["ls -la", ""]