import React, { Component } from 'react';
import swal from 'sweetalert';
import request from '../../api/request';
import Prfole from './profile';

export class ProfileContainer extends Component {
    constructor() {
        super();
        this.state = {
            profile: [],
            loding: false,
        }
    }

    componentDidMount = () => {
        this.getProfileData();
    }

    getProfileData = () => {
    
        request(`user/profile`, 'get')
        .then(result => {

            this.setState({
                profile: result.data
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

    toggleStatusProfile = (id, index) => {

        let profile = this.state.profile;

        this.setState({
            loading: true
        });

        request(`user/toggleStatus/${id}`, 'patch')
        .then(res => {
            
            swal(res.data.message);
            profile[index].status = ! profile[index].status;

            this.setState({
                loading: false,
                profile: profile
            });

        })
        .catch(error => {
            if(error.response && error.response.data && error.response.data.message) {
                swal(error.response.data.message);
            } else {
                swal("Failed to connect server.");
            }

            this.setState({
                loading: false
            });
            
        });
    }

    render() {
        return (
            <Prfole 
                {...this.state}
                toggleStatusProfile={this.toggleStatusProfile}
            />
        )
    }
}

export default ProfileContainer;
