import * as React from 'react'
import PostForm from '../../../components/Posts/PostForm';
import { withUpsertItem, WithUpsertItemInjectedProps } from '../../../common/ItemQuery';

interface Props {
    siteId: string;
}

class NewPostPage extends React.Component<Props & WithUpsertItemInjectedProps> {
    render() {
        const {
            upsertItem,
            siteId,
        } = this.props

        return <PostForm
            initialValues={{
                title: '',
                date: new Date()
            }}
            handleSubmitPost={async post => {
                await upsertItem({
                    groups: [],
                    type: 'POST',
                    data: JSON.stringify(post)
                }, siteId)
            }}
        />
    }
}

export default withUpsertItem(NewPostPage)