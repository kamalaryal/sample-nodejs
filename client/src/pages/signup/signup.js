import React, { Component } from 'react';
import { Button, Form, Grid, Header, Dropdown, Container } from 'semantic-ui-react';

const options = [
    { key: 'a', text: 'Admin', value: 'admin' },
    { key: 'w', text: 'Write', value: 'write' },
    { key: 'r', text: 'Read', value: 'read' },
  ]

export class Signup extends Component {
    render() {
        const { fullName, email, password, confirmPassword, loading, _updateField, handleSubmit, onChange } = this.props
        return (
            <Container>
                <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Signup to create account
                        </Header>
                        <Form size='large' onSubmit={(e) => {handleSubmit(e)}}>

                            <Form.Input
                                fluid
                                icon='user plus'
                                iconPosition='left'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={(event) => onChange(event)} 
                                value={fullName}
                            />

                            <Form.Input
                                fluid
                                icon='user plus'
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
                            <Form.Field>
                                <Dropdown
                                    button
                                    fluid
                                    className='icon'
                                    floating
                                    labeled
                                    selection
                                    icon='user plus'
                                    options={options}
                                    search
                                    placeholder='Select Role'
                                    onChange={(event,data) => _updateField(data.value, 'role')}
                                />
                            </Form.Field>
            
                            <Button
                                color='teal'
                                content='Create Account'
                                fluid
                                size='large'
                                loading={loading}
                                onSubmit={(e) => {handleSubmit(e)}}
                            />
                        </Form>
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}

export default Signup;
