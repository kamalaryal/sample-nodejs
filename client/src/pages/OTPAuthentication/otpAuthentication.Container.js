import React, { Component } from 'react';
import swal from 'sweetalert';
import request from '../../api/request';
import OTPAuthentication  from './otpAuthentication';
import { setDefaults }  from '../../api/request';
import { getOTPStatus } from '../../api/getOTPStatus';

export class OTPAuthenticationContainer extends Component {
    constructor() {
        super();
        this.state = {
            token: '',
            redirect: false,
            loading: false,
            loading1: false
        }
    }

    componentDidMount() {
        if(getOTPStatus()) {
            this.setState({
                redirect: true
            });
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
    
        request("user/validateOTP", "post", {
            token: this.state.token
        })
        .then(async res => {

            await localStorage.setItem('OTPStatus', JSON.stringify(res.data.otpStatus));
            setDefaults();
            swal(res.data.message);

            this.setState({
                loading: false,
                redirect: true
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

    _getOTP = () => {

        this.setState({
            loading1: true
        });
    
        request("user/getOTP", "get")
        .then(res => {

            swal(res.data.message);

            this.setState({
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

    render() {
        return (
            <OTPAuthentication 
                {...this.state}
                {...this.props}
                onChange={this.onChange}
                handleSubmit={this.handleSubmit}
                _getOTP={this._getOTP}
            />
        )
    }
}

export default OTPAuthenticationContainer;
