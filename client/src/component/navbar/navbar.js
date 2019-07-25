import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export class Navbar extends Component {
    state = { activeItem: 'myprofile' };
    handleItemClick = (e, { name }) => this.setState({ activeItem: name });
    
    render() {
        const { activeItem } = this.state;
        return (
            <nav>
                <Menu secondary  style={{justifyContent: 'center'}}>
                    <Menu.Menu style={{ display: "flex", flexDirection: "row", alignItems: 'center'}}>
                        {
                            this.props.navLinks && this.props.navLinks.map((element, index) => {
                                return (
                                    <Menu.Item
                                        as='div'
                                        name={element}
                                        key={index}
                                        style={{textTransform: 'uppercase'}}
                                        active={activeItem === {element}}
                                        onClick={this.handleItemClick}
                                        children={<NavLink to={`${element.replace(/ /g, '') === 'myprofile' ? '/' : element.replace(/ /g, '')}`}>{element}</NavLink>}
                                    />
                                )
                            })
                        }

                        <Button 
                            name='Sign Out'
                            content='Sign Out'
                            onClick={this.props.SignOut}
                        />
                    </Menu.Menu> 
                </Menu>
            </nav>
        )
    }
}

export default Navbar
