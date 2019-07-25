import React, { Component } from 'react';
import { Button, Form, Grid, Header, Container } from 'semantic-ui-react';

export class ResetPassword extends Component {
    render() {
        const { password, confirmPassword, loading, _resetPassword, onChange } = this.props
        return (
            <Container>
                <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Reset Password
                        </Header>
                        <Form size='large' onSubmit={(e) => {_resetPassword(e)}}>

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
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                type='password'
                                name='confirmPassword'
                                onChange={(event) => onChange(event)} 
                                value={confirmPassword}
                            />
            
                            <Button
                                color='teal'
                                content='Change Password'
                                fluid
                                size='large'
                                loading={loading}
                                onSubmit={(e) => {_resetPassword(e)}}
                            />
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

export default ResetPassword;
