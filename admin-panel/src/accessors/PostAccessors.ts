import { Item } from "../common/ItemQuery";

export interface Post {
    title: string;
    date: Date;
    password?: string;
}

export function getPost(item: Item) {
    var isPost = item.type === 'POST'
    if (!isPost) {
        throw 'not a post'
    }
    const post = JSON.parse(item.data) as Post;
    return post;
}