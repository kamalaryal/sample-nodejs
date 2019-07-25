import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NavBar from '../../component/navbar/navbar.container';
import SingleProfile from '../profile/singleProfile.Container';
import ProfilePage from '../profile/profile.Container';
import SignupPage from '../signup/signup.Container';
import EditOtherProfile from '../profile/EditOtherProfile.Container';
import { getRole } from '../../api/authenticate';

export class Home extends Component {
    render() {
        return (
            <BrowserRouter>
                <NavBar logout={this.props.logout} />
                <Switch>
                    <Route exact path='/' component={SingleProfile} />
                    {
                        getRole() === 'admin' ?
                            <Route exact path='/createaaccount' component={SignupPage} /> : <Redirect to='/myprofile' />
                    }
                    {
                        getRole() === 'admin' ?
                        <Route exact path='/editprofile' component={EditOtherProfile} data={this.props} /> : <Redirect to='/myprofile' />
                    }
                    {
                        getRole() === 'admin' ?
                        <Route exact path='/allprofile' component={ProfilePage} /> : <Redirect to='/myprofile' />
                    }
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Home;
