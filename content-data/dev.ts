import { MessageBus, Subjects } from 'content-message-bus'
import {
    UpsertPostCommandHandler, 
    UpsertSiteCommandHandler,
    DeletePostCommandHandler,
    DeleteSiteCommandHandler
} from './handlers'
import { ContentRepository } from './data';

// create a data repository
var repository = new ContentRepository({
    dialect: 'sqlite',
    storage: '../dev.database.sqlite',
    logging: true
})

// create a message bus service
var messageBus = new MessageBus({
    nats: {}
})

export function startService() {
    messageBus.connect();
    repository.sequelize.sync();

    // create handlers and subscribe
    const upsertPostCommandHandler = new UpsertPostCommandHandler(repository);
    messageBus.subscribe(Subjects.Commands.Post.Upsert, upsertPostCommandHandler.handle.bind(upsertPostCommandHandler))
    const upsertSiteCommandHandler = new UpsertSiteCommandHandler(repository);
    messageBus.subscribe(Subjects.Commands.Site.Upsert, upsertSiteCommandHandler.handle.bind(upsertSiteCommandHandler))
    const deletePostCommandHandler = new DeletePostCommandHandler(repository);
    messageBus.subscribe(Subjects.Commands.Post.Delete, deletePostCommandHandler.handle.bind(deletePostCommandHandler))
    const deleteSiteCommandHandler = new DeleteSiteCommandHandler(repository);
    messageBus.subscribe(Subjects.Commands.Site.Delete, deleteSiteCommandHandler.handle.bind(deleteSiteCommandHandler))

    console.log('connected to message bus')
}

export function stopService() {
    messageBus.close();
}

startService();