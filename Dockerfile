# Check out https://hub.docker.com/_/node to select a new base image
FROM --platform=linux/amd64 node:20-alpine

# create and set app directory
ARG CODE_SOURCE=/home/node/app
RUN mkdir -p $CODE_SOURCE
WORKDIR $CODE_SOURCE

# Bundle app source
COPY . $CODE_SOURCE

# Build this app
RUN npm install

# Skip prebuild script and directly run tsc
RUN mkdir -p dist && npx tsc

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=4000

EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]