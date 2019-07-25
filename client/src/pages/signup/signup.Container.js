import React, { Component } from 'react';
import swal from 'sweetalert';
import Signup from './signup';
import request from '../../api/request';

export class SignupContainer extends Component {
    constructor() {
        super();
        this.state = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword:'',
            role:'',
            loading: false
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    
    _updateField = (value,field) => {
        this.setState({
            [field] : value
        });
    }

    handleSubmit = (e,value) => {

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
            request("user/signup", "post", {
                fullName : this.state.fullName,
                email: this.state.email.toLowerCase(),
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
                role: this.state.role
            })
            .then( res => {
                swal(res.data.message);
                
                this.setState({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword:'',
                    role:'',
                    loading: false
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
        return (
            <Signup
                {...this.state}
                onChange = {this.onChange}
                _updateField = {this._updateField}
                handleSubmit = {this.handleSubmit}
            />
        )
    }
}

export default SignupContainer;
