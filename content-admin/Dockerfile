FROM node:11

# copy content-logs
WORKDIR /usr/src/content-logs
COPY ./content-logs/package*.json ./
RUN npm install
COPY ./content-logs/ ./
RUN npm run build

# copy content-message-bus
WORKDIR /usr/src/content-message-bus
COPY ./content-message-bus/package*.json ./
RUN npm install
COPY ./content-message-bus/ ./
RUN npm run build

# copy content-data
WORKDIR /usr/src/content-data
COPY ./content-data/package*.json ./
RUN npm install
COPY ./content-data/ ./
RUN npm run build

# copy content-admin
WORKDIR /usr/src/content-admin
COPY ./content-admin/package*.json ./
RUN npm install
COPY ./content-admin/ ./
RUN npm run build