import React, { Component } from 'react';
import { Container, Divider, Responsive, Dropdown, Grid, Form, Header, Button } from 'semantic-ui-react';

const options = [
    { key: 'a', text: 'Admin', value: 'admin' },
    { key: 'w', text: 'Write', value: 'write' },
    { key: 'r', text: 'Read', value: 'read' },
  ]
  
export class EditOtherProfile extends Component {
    render() {
        const { fullName, email, role, adminPassword, password, confirmPassword, loading, loading1, onChange, _updateField, editOtherProfile, patchotherPassword } = this.props;
        return (
            <Container>

                <Grid columns={2} relaxed='very' stackable>
                    <Grid.Column>

                        <Header as='h2' color='teal' textAlign='center'>
                            Account Details
                        </Header>
                        <Form onSubmit={(e) => {editOtherProfile(e)}}>
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
                                onChange={(event,data) => _updateField(data.value, 'role')}
                            />
                        </Form.Input>

                        <Button
                            content='Save'
                            color='teal'
                            fluid
                            size='large'
                            loading={loading} 
                            onSubmit={(e) => {editOtherProfile(e)}}
                        />
                        </Form>
                    </Grid.Column>
                    
                    <Grid.Column verticalAlign='middle'>
                    <Grid textAlign='center' style={{ height: '70vh' }} verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Change User Password
                        </Header>
                        <Form onSubmit={(e) => {patchotherPassword(e)}}>
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Admin password'
                                type='password'
                                name='adminPassword'
                                onChange={(event) => onChange(event)} 
                                value={adminPassword}
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
                                content='Change Password'
                                color='teal'
                                fluid
                                size='large'
                                loading={loading1} 
                                onSubmit={(e) => {patchotherPassword(e)}}
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

export default EditOtherProfile;
