import React, { Component } from 'react';
import swal from 'sweetalert';
import SingleProfile from './singleProfile';
import request from '../../api/request';

export class SingleProfileContainer extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            fullName: '',
            email: '',
            currentPassword: '',
            password: '',
            confirmPassword:'',
            loading: false,
            loading1: false
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    componentDidMount = () => {
        this.getProfileData();
    }

    editProfile = (e, value) => {
        this.setState({
            loading: true
        });

        e.preventDefault();
    
        request(`user/editProfile`, "patch", {
            email: this.state.email,
            fullName: this.state.fullName
        })
        .then(res => {
            swal(res.data.message);

            this.setState({
                email: this.state.email,
                fullName: this.state.fullName,
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

    getProfileData = () => {
    
        request(`user/profile/single`, 'get')
        .then(result => {

            this.setState({
                id: result.data._id,
                fullName: result.data.fullName,
                email: result.data.email,
                role: result.data.role
            });

        })
        .catch(error => {
            if(error.response && error.response.data && error.response.data.message) {
                swal(error.response.data.message);
            } else {
                swal("Failed to connect server.");
            }
            
        });
       
    }

    patchChangePassword = (e, value) => {
        this.setState({
            loading1: true
        });

        e.preventDefault();

        const { email, currentPassword, password, confirmPassword } = this.state;

        if (currentPassword.length === 0) {
            this.setState({
                loading1: false
            });
            
            swal("Current Password is empty.");

        } else if (password !== confirmPassword) {
            this.setState({
                loading1: false
            });
            
            swal("Password and Confirm Password do not match.");
            
        } else {

            request(`user/reset`, "patch", {
                email: email,
                currentPassword: currentPassword,
                password: password,
                confirmPassword: confirmPassword
            })
            .then(res => {
                swal(res.data.message);
    
                this.setState({
                    currentPassword: '',
                    password: '',
                    confirmPassword:'',
                    loading1: false
                });
    
            })
            .catch(error => {
                if (error.response.data.message) { 
                    swal("Opps!!! " + error.response.data.message);
                }
                
                this.setState({
                    loading1: false
                });
            });

        }
    }

    render() {
        return (
            <SingleProfile
                {...this.state}
                getProfileData={this.getProfileData}
                onChange={this.onChange}
                editProfile={this.editProfile}
                patchChangePassword={this.patchChangePassword}
            />
        )
    }
}

export default SingleProfileContainer;
