Components:

1. NATS message bus
2. content-data - sequelize models / NATS subscribers to respond to CQRS messages
3. content-admin - graphql frontend

to run:
1. run `run.sh` in `content-message-bus` to run the NATS server
2. run `npm run watch` in `content-message-bus` 
3. run `npm run watch` in `content-data`
4. run `npm run dev` in `content-data` to run the command handlers
5. run `npm run dev` in `content-admin` to run the graphql server


todo:
* script dev environment
* add compile-on-save and livereload on services
* make services more robust (auto restart if crash)
* make logging better, write a shared library that merges levels of context. log service name, method names, exception trace, etc
* environments / configurations library