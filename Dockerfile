FROM node:11
WORKDIR /usr/src/content
COPY ../content-logs ./content-logs
RUN ls ./content-logs