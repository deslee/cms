import * as React from 'react'
import { Link } from 'react-router-dom';


interface Site {
    id: string
    name: string
}

interface Props {
    sites: Site[]
}

class SiteListComponent extends React.Component<Props> {
    render() {
        const { sites } = this.props;
        return <div>
            <ul>{sites.map((site) => 
                <li key={site.id}><Link to={`/sites/${site.id}`}>{site.name}</Link></li>
            )}</ul>
        </div>
    }
}

export default SiteListComponent