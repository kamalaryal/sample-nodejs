import React, { Component } from 'react'
import { Container, Table, Grid, Header, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { getUserId } from '../../api/authenticate';

export class Profile extends Component {

    constructor() {
        super();
        this.state = {
            redirect : false,
            index : ""
        }
    }

    editWithRedirect = (index) => {
        this.setState ({
            redirect :  true,
            index : index
        })
    } 

    render() {
        const { profile } = this.props;

        if (this.state.redirect) {
            return <Redirect to={{
                pathname: '/editprofile',
                state: { data: profile[this.state.index] }
            }}
            />
        }
        return (
            <Container>
                <Grid textAlign='center' style={{ height: '30vh' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 800 }}>
                        <Header as='h2' color='teal' textAlign='center'>
                            All Account Details
                        </Header>
                        <Table striped unstackable={true} >

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>E-mail</Table.HeaderCell>
                                    <Table.HeaderCell>Role</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                    <Table.HeaderCell>Created Date</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    profile && profile.map((data, index) =>
                                        <Table.Row>
                                            <React.Fragment key={index}>
                                                <Table.Cell>{data.fullName}</Table.Cell>
                                                <Table.Cell>{data.email}</Table.Cell>
                                                <Table.Cell style={{textTransform:'capitalize'}}>{data.role}</Table.Cell>
                                                <Table.Cell>{data.status === true ? 'Active' : 'Block' }</Table.Cell>
                                                <Table.Cell>{data.createdAt.split('T')[0]}</Table.Cell>
                                                <Table.Cell>
                                                {
                                                    getUserId() === data._id === true  ? 
                                                        <Button content='Block' disabled /> 
                                                        : 
                                                        data.status === true ?
                                                        <Button content='Block' color='red' onClick={() => this.props.toggleStatusProfile(data._id, index)} /> :
                                                        <Button content='Active' color='green' onClick={() =>this.props.toggleStatusProfile(data._id, index)} />
                                                }
                                                {
                                                    getUserId() === data._id === true  ? 
                                                        <Button content='Edit' disabled /> 
                                                        : 
                                                        <Button content='Edit' onClick={() => this.editWithRedirect(index)}/> 
                                                }
                                                </Table.Cell>
                                            </React.Fragment>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>

                        </Table>
                    </Grid.Column>
                </Grid>
               </Container>
        )
    }
}

export default Profile;
