import React, { Component } from 'react';
import { Button, Form, Grid, Header, Container, Modal } from 'semantic-ui-react';
import ForgotPassword from '../forgotPassword/forgotPassword';

export class Login extends Component {
    render() {
        const { email, password, loading, handleSubmit, onChange } = this.props
        return (
            <Container>
                <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Login to your account
                        </Header>
                        <Form size='large' onSubmit={(e) => {handleSubmit(e)}}>
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='E-mail'
                                name='email'
                                onChange={(event) => onChange(event)} 
                                value={email}
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                name='password'
                                onChange={(event) => onChange(event)}
                                value={password}
                            />
            
                            <Button
                                color='teal'
                                fluid
                                content='Login'
                                size='large'
                                loading={loading}
                                onSubmit={(e) => {handleSubmit(e)}}
                            />
                        </Form>
                            <Modal size='mini' trigger={<Button  style={{marginTop: '10px'}} content='Forgot Password ?' />}  >
                            <ForgotPassword />
                            </Modal>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

export default Login
