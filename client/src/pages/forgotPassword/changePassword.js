import React, { Component } from 'react';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import request from '../../api/request';
import { Button, Form, Grid, Header, Container } from 'semantic-ui-react';

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            password: '',
            confirmPassword:'',
            loading: false,
            passwordChange: false,
            token: ''
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    
    _resetPassword = (e) => {

        this.setState({
            loading: true
        });

        e.preventDefault();
    
        const { password, confirmPassword } = this.state;
        let token = this.props.match.params.token;

        if (password !== confirmPassword) {
            this.setState({
                loading: false
            });
            
            swal("Password and Confirm Password do not match.");
        } else {
            request(`user/forgetpassword/${token}`, "patch", {
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
            .then(res => {
                swal(res.data.message);
                
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
        const { password, confirmPassword, loading, passwordChange } = this.state;
        if (passwordChange) {
            return <Redirect to={{
                pathname: '/'
            }}
            />
        }
        return (
            <Container>
                <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Reset Password
                        </Header>
                        <Form size='large' onSubmit={(e) => {this._resetPassword(e)}}>

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                name='password'
                                onChange={(event) => this.onChange(event)} 
                                value={password}
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                type='password'
                                name='confirmPassword'
                                onChange={(event) => this.onChange(event)} 
                                value={confirmPassword}
                            />
            
                            <Button
                                color='teal'
                                content='Change Password'
                                fluid
                                size='large'
                                loading={loading}
                                onSubmit={(e) => {this._resetPassword(e)}}
                            />
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

export default ResetPassword;
