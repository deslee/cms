Components:

1. NATS message bus
2. content-data - sequelize models / NATS subscribers to respond to CQRS messages
3. content-admin - graphql frontend

to run:
1. run `npm install` in `content-message-bus` 
1. run `npm run build` in `content-message-bus` 
1. run `run.sh` in `content-message-bus` to run the NATS server
1. run `npm install` in `content-logs` 
1. run `npm run build` in `content-logs` 
1. run `run.sh` in `content-logs` 
1. run `npm install` in `content-data` 
1. run `npm run build` in `content-data`
1. run `npm run dev` in `content-data` to run the command handlers
1. run `npm install` in `content-admin` 
1. run `npm run dev` in `content-admin` to run the graphql server


todo:
* script dev environment
* add compile-on-save and livereload on services
* make services more robust (auto restart if crash)
* make logging better, write a shared library that merges levels of context. log service name, method names, exception trace, etc

bugs:
* merge logic in logging utility class is causing weird issues