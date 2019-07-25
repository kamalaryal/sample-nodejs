import React, { Component } from 'react';
import { Container, Responsive, Grid, Header, Button,  Form, Divider, Dropdown } from 'semantic-ui-react';

const options = [
    { key: 'a', text: 'Admin', value: 'admin' },
    { key: 'w', text: 'Write', value: 'write' },
    { key: 'r', text: 'Read', value: 'read' },
  ]

export class SingleProfile extends Component {
    render() {
        const { fullName, email, role, currentPassword, password, confirmPassword, patchChangePassword, onChange, editProfile, loading, loading1 } = this.props;
        return (
            <Container>

                <Grid columns={2} relaxed='very' stackable>
                
                <Grid.Column>

                    <Header as='h2' color='teal' textAlign='center'>
                        Account Details
                    </Header>
                    <Form onSubmit={(e) => {editProfile(e)}}>
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        label='Full Name'
                        placeholder='Full Name'
                        name='fullName'
                        onChange={(event) => onChange(event)} 
                        value={fullName}
                    />
                    <Form.Input
                        icon='user'
                        iconPosition='left'
                        label='E-mail'
                        placeholder='E-mail'
                        name='email'
                        onChange={(event) => onChange(event)} 
                        value={email}
                    />
                    <Form.Input label='Role'>
                        <Dropdown
                            button
                            fluid
                            className='icon'
                            floating
                            labeled
                            selection
                            icon='user'
                            options={options}
                            placeholder='Select Role'
                            value={role}
                        />
                    </Form.Input>

                    <Button
                        content='Save'
                        color='teal'
                        fluid
                        size='large'
                        loading={loading} 
                        onSubmit={(e) => {editProfile(e)}}
                    />
                    </Form>
                </Grid.Column>

                <Grid.Column verticalAlign='middle'>
                    
                    <Grid textAlign='center' verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 450 }}>
                            <Header as='h2' color='teal' textAlign='center'>
                                Change Password
                            </Header>
                            <Form size='large' onSubmit={(e) => {patchChangePassword(e)}}>
                                
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Current password'
                                    type='password'
                                    name='currentPassword'
                                    onChange={(event) => onChange(event)} 
                                    value={currentPassword}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='New password'
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
                                    fluid
                                    size='large'
                                    content='Change Password'
                                    loading={loading1} 
                                    onSubmit={(e) => {patchChangePassword(e)}}
                                />

                            </Form>
                        </Grid.Column>
                    </Grid>

                </Grid.Column>
                
                </Grid>

                <Responsive minWidth={768}>
                    <Divider vertical >Or</Divider>
                </Responsive>

            </Container>
        )
    }
}

export default SingleProfile
