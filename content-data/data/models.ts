import { Sequelize, DataTypes } from 'sequelize';

export function getModels(sequelize: Sequelize, DataTypes: DataTypes) {

    const Site = sequelize.define('site', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        }
    })

    const Category = sequelize.define('category', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        siteId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Site,
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    const Post = sequelize.define('post', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        siteId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Site,
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        },
        password: {
            type: DataTypes.STRING
        },
        passwordSalt: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        }
    });

    const Slice = sequelize.define('slice', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        type: {
            type: DataTypes.ENUM('paragraph', 'image', 'video')
        },
        siteId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Site,
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Post,
                key: 'id'
            }
        },
        text: {
            type: DataTypes.TEXT('long')
        },
        url: {
            type: DataTypes.STRING
        },
        loop: {
            type: DataTypes.BOOLEAN
        },
        autoplay: {
            type: DataTypes.BOOLEAN
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        }
    })

    const Asset = sequelize.define('asset', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        siteId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Site,
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('image')
        },
        description: {
            type: DataTypes.TEXT('medium')
        },
        url: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        }
    })

    const AssetSlice = sequelize.define('assetslice', {
        siteId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Site,
                key: 'id'
            }
        },
        assetId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Asset,
                key: 'id'
            }
        },
        sliceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Slice,
                key: 'id'
            }
        },
    })

    const PostCategory = sequelize.define('postcategory', {
        siteId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Site,
                key: 'id'
            }
        },
        postId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Post,
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Category,
                key: 'id'
            }
        },
    })

    // associations to / from site
    Site.hasMany(Post)
    Post.belongsTo(Site)
    Site.hasMany(Category)
    Category.belongsTo(Site)
    Site.hasMany(Slice)
    Slice.belongsTo(Site)
    Site.hasMany(Asset)
    Asset.belongsTo(Site)
    Site.hasMany(AssetSlice)
    AssetSlice.belongsTo(Site)
    Site.hasMany(PostCategory)
    PostCategory.belongsTo(Site)
    Post.hasMany(Slice)

    PostCategory.belongsTo(Category, { foreignKey: 'categoryId' })
    PostCategory.belongsTo(Post, { foreignKey: 'postId' })

    return { Site, Post, PostCategory, Category, Slice };
}