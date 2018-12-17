FROM node:11

# copy content-logs
WORKDIR /usr/src/content-logs
COPY ./content-logs/package*.json ./
RUN yarn
COPY ./content-logs/ ./
RUN yarn run build

# copy content-message-bus
WORKDIR /usr/src/content-message-bus
COPY ./content-message-bus/package*.json ./
RUN yarn
COPY ./content-message-bus/ ./
RUN yarn run build

# copy content-data
WORKDIR /usr/src/content-data
COPY ./content-data/package*.json ./
RUN yarn
COPY ./content-data/ ./
RUN yarn run build
CMD ["node", "dist/dev.js"]