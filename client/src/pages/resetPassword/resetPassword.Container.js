import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import swal from 'sweetalert';
import request from '../../api/request';
import ResetPassword from './resetPassword';

export class ResetPasswordContainer extends Component {
    constructor() {
        super();
        this.state = {
            password: '',
            confirmPassword:'',
            loading: false,
            passwordChange: false
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    
    _resetPassword = (e,value) => {

        this.setState({
            loading: true
        });

        e.preventDefault();
    
        const { password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            this.setState({
                loading: false
            });
            
            swal("Password and Confirm Password do not match.");
        } else {
            request(`user/password/reset`, "patch", {
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
            .then( async res => {

                swal(res.data.message);
                localStorage.clear();
                this.props.logout();
                
                this.setState({
                    password: '',
                    confirmPassword:'',
                    loading: false,
                    passwordChange: true
                });
        
            })
            .catch(error => {
                if (error.response.data.message) {
                    swal("Opps!!! " + error.response.data.message);
                }

                this.setState({
                    loading: false
                });

            });
            
        }        
    }

    render() {
        if(this.state.passwordChange) {
            return <Redirect to='/' />
        }
        return (
            <ResetPassword
                {...this.state}
                onChange = {this.onChange}
                _resetPassword = {this._resetPassword}
            />
        )
    }
}

export default ResetPasswordContainer;
