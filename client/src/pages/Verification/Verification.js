import React, { Component } from 'react';
import swal from 'sweetalert';
import { Container, Message } from 'semantic-ui-react';
import request from '../../api/request';

class Verification extends Component {

    componentDidMount() {
        this.verifyUserBase()
    }

    verifyUserBase = () => {

        let token = this.props.match.params.token;

        request(`/user/verification/${token}`, 'patch')
        .then(res => {
            swal("Your profile is verified.");
        })
        .catch(error => {
            if (error.response.data.message) {
                swal("Opps!!! " + error.response.data.message);
            }
        });
    } 

    render() {
        return (
            <Container>
                <Message>
                    <Message.Header>Your profile is verified.</Message.Header>
                </Message>    
            </Container>
        )
    }
}

export default Verification
