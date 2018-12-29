import * as Yup from 'yup';

export interface Slice {
    type: string
}

export const SliceSchema = Yup.object();

export interface ParagraphSlice extends Slice {
    content: string
}

export interface VideoSlice extends Slice {
    url: string
    loop: boolean
    autoplay: boolean
}

export interface ImagesSlice extends Slice {
    images: string[]
}

export interface Post {
    id: string,
    title: string,
    slices: Slice[]
}

export const PostSchema = Yup.object().shape({
    id: Yup.string(),
    title: Yup.string(),
    slices: Yup.array(SliceSchema)
})

export interface Site {
    id: string,
    name: string,
    title: string,
    subtitle: string,
    googleAnalyticsId: string,
    copyright: string,
    posts: Post[],
}

export const SiteSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string(),
    title: Yup.string(),
    subtitle: Yup.string(),
    googleAnalyticsId: Yup.string(),
    copyright: Yup.string(),
    posts: Yup.array(PostSchema)
})