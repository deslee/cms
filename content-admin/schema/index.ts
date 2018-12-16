import { typeDef as Asset, resolvers as assetResolvers } from './asset'
import { typeDef as Category, resolvers as categoryResolvers } from './category'
import { typeDef as Post, resolvers as postResolvers } from './post'
import { typeDef as Shared, resolvers as sharedResolvers } from './shared'
import { typeDef as Site, resolvers as siteResolvers } from './site'
import { typeDef as Slice, resolvers as sliceResolvers } from './slice'
import { typeDef as Query, resolvers as queryResolvers } from './Query'
import { typeDef as Mutation, resolvers as mutationResolvers } from './Mutation'
import * as _ from 'lodash'

export const typeDefs = [Shared, Asset, Category, Post, Site, Slice, Query, Mutation]
export const resolvers = _.merge(queryResolvers, mutationResolvers, categoryResolvers, siteResolvers, sharedResolvers, assetResolvers, sliceResolvers, postResolvers)