import * as React from 'react'
import { Link } from 'react-router-dom';

interface Post {
    id: string
    title: string
    slices: any[]
}

interface Props {
    id: string
    name: string
    posts: Post[]
}


class SiteComponent extends React.Component<Props> {
    render() {
        const {
            name,
            posts
        } = this.props;

        return <div>
            <h1>{name}</h1>
            {posts.map(post => <div key={post.id}>
                <div>{post.title}</div>
                <div>slices:</div>
                {post.slices.map((slice, i) => <div key={i}>
                    <pre>{JSON.stringify(slice, null, 2)}</pre>
                </div>)}
            </div>)}
        </div>
    }
}

export default SiteComponent;