import * as React from 'react';
import { Sidebar, Menu, Icon, Segment, Dropdown, Grid } from 'semantic-ui-react';
import { withAuth, WithAuthInjectedProps } from '../data/auth';
import classes from './Container.module.css';

interface Props {

}
interface State {
}

class Container extends React.Component<Props & WithAuthInjectedProps, State> {
    render() {
        const {
            auth: { user, updateUser }
        } = this.props;

        return (
            <Grid>
                <Grid.Column width={3}>
                    <Menu size="massive" vertical>
                        <Menu.Item as='a'>
                            <Icon name='browser' />
                            Site Data
                    </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='file' />
                            Pages
                    </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='pencil' />
                            Posts
                    </Menu.Item>
                        <Menu.Item as='a'>
                            <Icon name='file image' />
                            Assets
                    </Menu.Item>
                        {user &&
                            <Dropdown item text={user.name}>
                                <Dropdown.Menu direction="right">
                                    <Dropdown.Item text="Sign out" onClick={() => updateUser()}></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                    </Menu>
                </Grid.Column>
                <Grid.Column width={13} >
                    <div className={classes.children}>
                        {this.props.children}
                    </div>
                </Grid.Column>
            </Grid>
        )

        // return <Sidebar.Pushable as={Segment}>
        //     <Sidebar
        //         as={Menu}
        //         animation='push'
        //         icon='labeled'
        //         inverted
        //         vertical
        //         visible={true}
        //         width='thin'
        //     >
        //         <Menu.Item as='a'>
        //             <Icon name='browser' />
        //             Site Data
        //         </Menu.Item>
        //         <Menu.Item as='a'>
        //             <Icon name='file' />
        //             Pages
        //         </Menu.Item>
        //         <Menu.Item as='a'>
        //             <Icon name='pencil' />
        //             Posts
        //         </Menu.Item>
        //         <Menu.Item as='a'>
        //             <Icon name='file image' />
        //             Assets
        //         </Menu.Item>
        //         {user &&
        //             <Dropdown item text={user.name}>
        //                 <Dropdown.Menu direction="left">
        //                     <Dropdown.Item text="Sign out" onClick={() => updateUser()}></Dropdown.Item>
        //                 </Dropdown.Menu>
        //             </Dropdown>
        //         }
        //     </Sidebar>
        //     <Sidebar.Pusher>
        //         <div className={classes.children}>
        //             {this.props.children}
        //         </div>
        //     </Sidebar.Pusher>
        // </Sidebar.Pushable>
    }
}

export default withAuth(Container);