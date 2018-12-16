import { Op } from 'sequelize';
import * as Sequelize from 'sequelize'
import { SiteInput, PostInput, SliceType } from './inputs';
import { getModels } from './models';

export interface Site {
    id: string
    name: string
}
export interface Slice {
    id: string
    type: SliceType
    text: string
    url: string
    autoplay: string
    loop: string
}
export interface Post {
    id: string
    title: string
    date: Date
    slices: Slice[]
}
export interface Category {
    id: string
    name: string
}

const Mappers = {
    Site: (site: any) => ({
        id: site.id,
        name: site.name
    } as Site),
    Post: (post: any) => ({
        id: post.id,
        title: post.title,
        date: post.date,
        slices: (post.slice || []).map(Mappers.Slice)
    } as Post),
    Category: (category: any) => ({
        id: category.id,
        name: category.name
    } as Category),
    Slice: (slice: any) => ({
        id: slice.id,
        type: slice.type,
        text: slice.text,
        url: slice.url,
        autoplay: slice.autoplay,
        loop: slice.loop
    } as Slice)
}

type RepositoryConfig = Sequelize.Options;

export class ContentRepository {
    models: any;
    sequelize: Sequelize.Sequelize;

    constructor(config: RepositoryConfig) {
        this.sequelize = new Sequelize(config)

        this.models = getModels(this.sequelize, Sequelize);
    }

    async getSites(): Promise<Site[]> {
        let dbSites = await this.models.Site.findAll();
        let sites = dbSites.map(Mappers.Site)
        return sites;
    }

    async getSite(siteId: string): Promise<Site | null> {
        var dbSite = await this.models.Site.find({ where: { id: { [Op.eq]: siteId } } })
        return dbSite && Mappers.Site(dbSite);
    }

    async getSiteFromPostId(postId: string): Promise<Site | null> {
        var dbPost: any = await this.models.Post.find({ where: { id: { [Op.eq]: postId } } })
        if (!dbPost) return null;
        return await this.getSite(dbPost.siteId);
    }

    async upsertSite(site: SiteInput): Promise<string | undefined> {
        let response: string = undefined
        if (!site.data) { site.data = {} }
        if (site.id) {
            await this.models.Site.update(site, { where: { id: { [Op.eq]: site.id } } });
        } else {
            var createdSite = await this.models.Site.create(site);
            response = createdSite.id
        }
        return response;
    }

    async getCategoriesForPost(postId: string): Promise<Category[]> {
        const postCategories: any =
            await this.models.PostCategory.findAll({ where: { postId: { [Op.eq]: postId } } })
        const categories = await this.models.Category.findAll({ where: { id: { [Op.in]: postCategories.map((pc: any) => pc.categoryId) } } })
        return categories.map(Mappers.Category)
    }

    async getCategoriesForSite(siteId: string): Promise<Category[]> {
        const postCategories: any =
            await this.models.PostCategory.findAll({ where: { siteId: { [Op.eq]: siteId } } })
        const categories = await this.models.Category.findAll({ where: { id: { [Op.in]: postCategories.map((pc: any) => pc.categoryId) } } })
        return categories.map(Mappers.Category)
    }

    async upsertPost(post: PostInput): Promise<string | undefined> {
        let response: string = undefined;

        if (!post.data) { post.data = {} }
        // TODO: handle salting

        if (post.id) {
            await this.models.Post.update(post, { where: { id: { [Op.eq]: post.id } } })
        } else {
            if (!post.date) { post.date = new Date() }
            let createdPost: any = await this.models.Post.create(post);
            post.id = createdPost.id
            response = post.id;
        }

        if (!post.slices) post.slices = []
        if (!post.categories) post.categories = []

        if (post.categories.length) {
            // get all categories mentioned in post
            let foundCategories: any = await this.models.Category.findAll({
                where: {
                    [Op.and]: [
                        {
                            siteId: {
                                [Op.eq]: post.siteId
                            }
                        },
                        {
                            name: {
                                [Op.in]: post.categories
                            }
                        }
                    ]
                }
            })

            // add categories that do not exist yet
            let createdCategories: any = await Promise.all(post.categories.filter((c: any) => !foundCategories.find((fc: any) => fc.name === c))
                .map((categoryName: string) => this.models.Category.create({
                    id: undefined,
                    siteId: post.siteId,
                    name: categoryName
                })));

            let categories: any = foundCategories.concat(createdCategories);

            let allPostCategories: any = await this.models.PostCategory.findAll({
                where: {
                    [Op.and]: [
                        {
                            postId: {
                                [Op.eq]: post.id
                            }
                        },
                        {
                            siteId: {
                                [Op.eq]: post.siteId
                            }
                        }
                    ]
                }
            })

            // add categories to post
            await Promise.all(categories.filter(category => !allPostCategories.find(pc => pc.categoryId === category.id))
                .map(category => this.models.PostCategory.create({
                    siteId: post.siteId,
                    postId: post.id,
                    categoryId: category.id
                })));
            // remove categories from post
            let categoriesToRemoveFromPost
                = allPostCategories.filter(pc => !categories.find(c => c.id === pc.categoryId));
            if (categoriesToRemoveFromPost.length) {
                await this.models.PostCategory.destroy({
                    where: {
                        id: {
                            [Op.in]: categoriesToRemoveFromPost.map(c => c.id)
                        }
                    }
                })
            }
        }

        if (post.slices.length) {
            // prepopulate required members if nonexistant
            post.slices.forEach((slice) => {
                if (!slice.data) { slice.data = {} }
                { slice.siteId = post.siteId }
                { slice.postId = post.id }
            })

            // get all slices belonging to post
            var slicesInDb: any = await this.models.Slice.findAll({ where: { postId: { [Op.eq]: post.id } } })

            // add slices without ids
            let createdSlices: any = await Promise.all(post.slices.filter(slice => !slice.id).map((slice: any) => this.models.Slice.create(slice)))

            // delete slices that do not exist in the post anymore
            let slicesToDelete: any = slicesInDb.filter(dbSlice => !post.slices.find(s => s.id === dbSlice.id))
            if (slicesToDelete.length) {
                await this.models.Slice.destroy({
                    where: {
                        id: {
                            [Op.in]: slicesToDelete.map(s => s.id)
                        }
                    }
                })
            }

            // update slices with ids
            let slicesToUpdate = post.slices.filter(s => s.id);
            await Promise.all(slicesToUpdate.map(slice => this.models.Slice.update(slice, { where: { id: { [Op.eq]: slice.id } } })))
        }

        return response;
    }

    async getPostsForSite(siteId: string): Promise<Post[]> {
        var result: any = await this.models.Post.findAll({
            where: {
                siteId: { [Op.eq]: siteId }
            },
            include: [{
                model: this.models.Slice
            }]
        })
        result = result.map(Mappers.Post)
        return result
    }

    async getPost(postId: string): Promise<Post | undefined> {
        var result: any = await this.models.Post.find({
            where: {
                id: { [Op.eq]: postId }
            },
            include: [{
                model: this.models.Slice
            }]
        })
        result = result && Mappers.Post(result)
        return result
    }

    async getPostsForCategory(categoryId: string): Promise<Post[]> {
        var postCategories: any = await this.models.PostCategory.findAll({
            where: {
                categoryId: { [Op.eq]: categoryId }
            },
            include: [
                {
                    model: this.models.Post,
                    include: [
                        {
                            model: this.models.Slice
                        }
                    ]
                }
            ]
        })
        var posts = postCategories.map(pc => pc.post)
        posts = posts.map(Mappers.Post)
        return posts
    }

    async deleteSite(siteId: string): Promise<void> {
        await this.models.Site.destroy({
            where: {
                id: {
                    [Op.eq]: siteId
                }
            }
        })
    }

    async deletePost(postId: string): Promise<void> {
        await this.models.PostCategory.destroy({
            where: {
                postId: {
                    [Op.eq]: postId
                }
            }
        })
        await this.models.Slice.destroy({
            where: {
                postId: {
                    [Op.eq]: postId
                }
            }
        })

        await this.models.Post.destroy({
            where: {
                id: {
                    [Op.eq]: postId
                }
            }
        })
    }
}