import React, { Component } from 'react';
import { Container, Header, Grid, Form, Button } from 'semantic-ui-react';
import Home from '../home/home';

export class OTPAuthentication extends Component {
    render() {
        if (this.props.redirect) {
            return <Home logout={this.props.logout} />
        }
        const { token, loading, handleSubmit, onChange, loading1, _getOTP } = this.props;
        return (
            <Container>
                <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            OTP Authentication
                        </Header>
                        <Form size='large' onSubmit={(e) => {handleSubmit(e)}}>

                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Token'
                                name='token'
                                onChange={(event) => onChange(event)} 
                                value={token}
                            />
                            <Button
                                color='teal'
                                fluid
                                content='Submit OTP Code'
                                size='large'
                                loading={loading}
                                onSubmit={(e) => {handleSubmit(e)}}
                            />

                        </Form>

                            <Button
                                color='teal'
                                fluid
                                style={{marginTop:'10px'}}
                                content='Get New OTP Code'
                                size='large'
                                loading={loading1}
                                onClick={(e) => {_getOTP(e)}}
                            />

                    </Grid.Column>
                </Grid>    
            </Container>
        )
    }
}

export default OTPAuthentication;
