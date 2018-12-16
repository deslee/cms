import 'mocha'
import * as winston from 'winston'
import { ContentRepository, SiteInput, PostInput, Slice } from '../data'
import { UpsertSiteCommandHandler, UpsertPostCommandHandler, DeleteSiteCommandHandler, DeletePostCommandHandler } from '../handlers/commandHandler';
import assert = require('assert');

describe('Command Handler Tests', function () {

    const repository = new ContentRepository({
        dialect: 'sqlite',
        storage: 'test.database.sqlite',
        logging: false
    })
    const logger = winston.createLogger({
        transports: [
            new winston.transports.File({ filename: 'test.dev.log' })
        ]
    })

    const upsertSiteHandler = new UpsertSiteCommandHandler(repository, logger);
    const upsertPostHandler = new UpsertPostCommandHandler(repository, logger);
    const deleteSiteHandler = new DeleteSiteCommandHandler(repository, logger);
    const deletePostHandler = new DeletePostCommandHandler(repository, logger);

    let siteId;
    let postId: string, otherPostId: string, visualCategoryId: string, animationCategoryId: string, blogCategoryId: string;
    const visualCategoryName = 'Visual', animationCategoryName = 'Animation', blogCategoryName = 'Blog'

    this.beforeAll(async function () {
        await repository.sequelize.sync()
    })

    it('Should let me create a site', async function () {
        const input: SiteInput = {
            name: "Desmond's test site"
        }
        const response = await upsertSiteHandler.handle({
            correlationId: '',
            payload: input
        });
        assert(response.success)
        assert(siteId = response.created)

        const site = await repository.getSite(siteId)
        assert(site)
        assert.strictEqual(site.name, input.name)
    })

    it('should let me update a site', async function () {
        const input: SiteInput = {
            id: siteId,
            name: 'Updated name'
        }
        const response = await upsertSiteHandler.handle({
            correlationId: '',
            payload: input
        });
        assert(response.success)
        assert.strictEqual(response.created, undefined)

        const site = await repository.getSite(siteId)
        assert(site)
        assert.strictEqual(site.name, input.name)
    })

    it('Should be able to create a post with no additional parameters', async function () {
        const input: PostInput = {
            siteId: siteId,
            title: 'Hello world! This is just a post'
        }
        const response = await upsertPostHandler.handle({
            correlationId: '',
            payload: input
        });
        assert(response.success)
        assert(postId = response.created)

        const post = await repository.getPost(postId)
        assert(post)
        assert.strictEqual(post.title, input.title)
    })

    it('Should be able to mutate the post that it just created', async function () {
        const input: PostInput = {
            id: postId,
            siteId: siteId,
            title: 'This is a brand new title to a post'
        }
        const response = await upsertPostHandler.handle({
            correlationId: '',
            payload: input
        });
        assert(response.success)
        assert.strictEqual(response.created, undefined)

        const post = await repository.getPost(postId)
        assert(post)
        assert.strictEqual(post.title, input.title)
    })

    it('Should be able to add categories to a post', async function () {
        const input: PostInput = {
            id: postId,
            siteId: siteId,
            title: 'Hello world! This is an empty post that I just edited',
            categories: [visualCategoryName, animationCategoryName]
        }
        const response = await upsertPostHandler.handle({
            correlationId: '',
            payload: input
        });
        assert(response.success)

        const categories = await repository.getCategoriesForPost(postId)
        assert(categories)
        assert.strictEqual(categories.length, 2)
        assert(visualCategoryId = categories.find(c => c.name === visualCategoryName).id)
        assert(animationCategoryId = categories.find(c => c.name === animationCategoryName).id)
    })

    it('Should be able to delete a category from a post', async function () {
        const input: PostInput = {
            id: postId,
            siteId: siteId,
            title: 'Hello world! This is an empty post that I just edited',
            categories: [visualCategoryName]
        }
        const response = await upsertPostHandler.handle({
            correlationId: '',
            payload: input
        });
        assert(response.success)

        const categories = await repository.getCategoriesForPost(postId)
        assert.strictEqual(categories.length, 1)
        assert.strictEqual(categories[0].name, visualCategoryName)
    })

    it('should be able to create a new post with categories', async function () {
        const input: PostInput = {
            siteId: siteId,
            title: 'Hello world! This is my special new other post',
            categories: [visualCategoryName, blogCategoryName]
        }
        const response = await upsertPostHandler.handle({
            correlationId: '',
            payload: input
        });
        assert(response.success)
        assert(otherPostId = response.created)

        const posts = await repository.getPostsForSite(siteId)
        assert.strictEqual(posts.length, 2)

        const categories = await repository.getCategoriesForPost(otherPostId)
        assert.strictEqual(categories.length, 2)
        assert(blogCategoryId = categories.find(c => c.name === blogCategoryName).id)
        assert.strictEqual(visualCategoryId, categories.find(c => c.name === visualCategoryName).id, 'visual category id wrong or not found')

        var postsForCategory = await repository.getPostsForCategory(blogCategoryId)
        assert.strictEqual(postsForCategory.length, 1)
        assert.strictEqual(postsForCategory[0].id, otherPostId)
    })

    it('should be able to add slices to a post', async function () {
        let input: PostInput = {
            id: postId,
            siteId: siteId,
            slices: [
                {
                    type: 'PARAGRAPH',
                    text: 'Hello world!'
                },
                {
                    type: 'VIDEO',
                    url: "http://youtube.com/ajdsioaj"
                }
            ]
        }
        const response = await upsertPostHandler.handle({
            correlationId: '',
            payload: input
        })
        assert(response.success)

        const post = await repository.getPost(postId);
        assert.strictEqual(post.slices.length, 2)
        let paragraphSlice: Slice;
        let videoSlice: Slice;
        assert(paragraphSlice = post.slices.find(s => s.type === 'PARAGRAPH'))
        assert(videoSlice = post.slices.find(s => s.type === 'VIDEO'))
        assert.strictEqual(paragraphSlice.text, input.slices[0].text)
        assert.strictEqual(videoSlice.url, input.slices[1].url)
    })

    it('should be able to delete a post', async function () {
        const response = await deletePostHandler.handle({
            correlationId: '',
            payload: postId
        })
        assert(response.success)

        const post = await repository.getPost(postId);
        assert.strictEqual(post, null)

        let posts = await repository.getPostsForSite(siteId);
        assert.strictEqual(posts.length, 1)
    })

    it('Should let me delete a site', async function () {
        const response = await deleteSiteHandler.handle({
            correlationId: '',
            payload: siteId
        })
        assert(response.success)

        let site = await repository.getSite(siteId)
        assert.strictEqual(site, null);

        let posts = await repository.getPostsForSite(siteId);
        assert.strictEqual(posts.length, 0)
    })
})