import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import{ getJwt } from './api/getJwt';
import { getStatus } from './api/authenticate';
import LoginPage from './pages/login/login.Container';
import OTPAuthentication from './pages/OTPAuthentication/otpAuthentication.Container';
import ResetPassword from './pages/resetPassword/resetPassword.Container';
import ChangePassword from './pages/forgotPassword/changePassword';
import VerfiyUser from './pages/Verification/Verification';

class App extends Component {
  constructor() {

		super();

		this.state = {
			isGuest: getJwt() === null ? true : false
    };

  }

  login = () => {

    this.setState({
      isGuest: false
    })
  }

  logout = () => {

    this.setState({
      isGuest: true
    })
  }
  
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/forgotpassword/:token?" component={ChangePassword} />
          <Route exact path="/user/verification/:token?" component={VerfiyUser} />
          <Route path="/" render={() =>  !this.state.isGuest ?
             !getStatus() ? <ResetPassword logout={this.logout} /> : <OTPAuthentication logout={this.logout} /> : 
             <LoginPage login={this.login} />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
