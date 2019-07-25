import React, { Component } from 'react';
import swal from 'sweetalert';
import Login from './login';
import request from '../../api/request';
import { setDefaults }  from '../../api/request';

export class LoginContainer extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            loading: false
        }
    } 

    onChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    handleSubmit = (e,value) => {

        this.setState({
            loading: true
        });

        e.preventDefault();
    
        request("user/login", "post", {
            email: this.state.email.toLowerCase(),
            password: this.state.password
        })
        .then( async res => {
            await localStorage.setItem('Loginjwt', JSON.stringify(res.data));
            setDefaults();
            this.props.login();
            swal(res.data.message);
            this.setState({
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
    
    render() {
        return (
            <Login
                {...this.state}
                onChange = {this.onChange}
                handleSubmit = {this.handleSubmit}
            />
        )
    }
}

export default LoginContainer;
