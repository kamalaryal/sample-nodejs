import React, { Component } from 'react';
import swal from 'sweetalert';
import request from '../../api/request';
import { Button, Form, Header, Container } from 'semantic-ui-react';

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            email:'',
            loading: false
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    _getEmail = (e,value) => {

        this.setState({
            loading: true
        });

        e.preventDefault();

        request(`user/forgetpassword`, "post", {
            email: this.state.email.toLowerCase()
        })
        .then(res => {

            swal(res.data.message);
            
            this.setState({
                email: '',
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
        const { email, loading } = this.props
        return (
            <Container>
                <Header as='h2' color='teal' textAlign='center'>
                    Enter E-mail
                </Header>
                <Form size='large' onSubmit={(e) => {this._getEmail(e)}}>

                    <Form.Input
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeholder='E-mail'
                        name='email'
                        onChange={(event) => this.onChange(event)} 
                        value={email}
                    />
    
                    <Button
                        color='teal'
                        content='Send Reset Link'
                        fluid
                        size='large'
                        loading={loading}
                        onSubmit={(e) => {this._getEmail(e)}}
                    />
                </Form>
            </Container>
        )
    }
}

export default ResetPassword;
