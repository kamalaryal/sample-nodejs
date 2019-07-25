import React, { Component } from 'react';
import swal from 'sweetalert';
import request from '../../api/request';
import EditOtherProfile from './editOtherProfile';

export class EditOtherProfileContainer extends Component {
    constructor(props) {
        super(props);
        let profile = props.location.state.data
        this.state = {
            id: profile._id,
            fullName: profile.fullName,
            email: profile.email,
            role: profile.role,
            adminPassword: '',
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

    _updateField = (value,field) => {
        this.setState({
            [field] : value
        });
    }

    editOtherProfile = (e, value) => {
        this.setState({
            loading: true
        });

        e.preventDefault();
    
        request(`user/editOtherProfile/${this.state.id}`, "patch", {
            email: this.state.email,
            fullName: this.state.fullName,
            role: this.state.role
        })
        .then(res => {
            swal(res.data.message);

            this.setState({
                email: this.state.email,
                fullName: this.state.fullName,
                role: this.state.role,
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

    patchotherPassword = (e, value) => {
        this.setState({
            loading1: true
        });

        e.preventDefault();

        const { id, email, adminPassword, password, confirmPassword } = this.state;

        if (adminPassword.length === 0) {
            this.setState({
                loading1: false
            });
            
            swal("Admin Password is empty.");

        } else if (password !== confirmPassword) {
            this.setState({
                loading1: false
            });
            
            swal("Password and Confirm Password do not match.");
            
        } else {

            request(`user/reset/single/${id}`, "patch", {
                email: email,
                adminPassword: adminPassword,
                password: password,
                confirmPassword: confirmPassword
            })
            .then(res => {
                swal(res.data.message);
    
                this.setState({
                    adminPassword: '',
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
            <EditOtherProfile
                {...this.state}
                onChange={this.onChange}
                _updateField={this._updateField}
                editOtherProfile={this.editOtherProfile}
                patchotherPassword={this.patchotherPassword}
            />
        )
    }
}

export default EditOtherProfileContainer;
