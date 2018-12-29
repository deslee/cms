import * as React from 'react';
import { Sidebar, Menu, Icon, Segment, Dropdown, Grid, Responsive } from 'semantic-ui-react';
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
                <Responsive as={Grid.Column} width={3} minWidth={1024}>
                    <Menu size="massive" vertical style={{width: '100%'}}>
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
                </Responsive>
                <Responsive as={Grid.Column} width={16} maxWidth={1024}>
                    <Menu size="massive">
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
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Sign out" onClick={() => updateUser()}></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                    </Menu>
                </Responsive>

                <Grid.Column computer={13} tablet={16} >
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