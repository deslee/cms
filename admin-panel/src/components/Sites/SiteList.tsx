import * as React from 'react'
import { Link } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import Site from './Site';




interface Props {
    sites: Site[]
}

class SiteListComponent extends React.Component<Props> {
    render() {
        const { sites } = this.props;
        return <List selection relaxed divided size="massive">
            {sites.map((site) =>
                <List.Item key={site.id} as={Link} to={`/sites/${site.id}`}>
                    <List.Header>{site.name}</List.Header>
                    {site.id}
                </List.Item>
            )}
        </List>
    }
}

export default SiteListComponent