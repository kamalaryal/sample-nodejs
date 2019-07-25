import React, { Component } from 'react';
import { getRole } from '../../api/authenticate';
import Navbar from './navbar.js';

export class NavbarContainer extends Component {
    constructor() {
        super();
        if(getRole() !== 'admin') {
            this.state={
                navLinks: [
                    "my profile"
                ]
            }
        } else {
            this.state={
                navLinks: [
                    "my profile",
                    "all profile",
                    "create a account"
                ]
            }
        }
    }

    SignOut = (e) => {
        localStorage.clear();
        this.props.logout();
    }


    render() {
        return (
            <Navbar
                {...this.state}
                logout={this.props.logout}
                SignOut={this.SignOut}
            />
        )
    }
}

export default NavbarContainer
