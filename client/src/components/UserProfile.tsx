import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../main"
import {Button, Card, Col, ListGroup} from "react-bootstrap"
import {observer} from "mobx-react-lite"
import {check} from '../http/userAPI'
import ChangePasswordForm from "./modals/ChangePasswordForm"
import EditProfileForm from "./modals/EditProfileForm"


const UserProfile = observer(() => {
    const {user} = useContext(Context)
    const [editModalVisible, setEditModalVisible] = useState(false)

    useEffect(() => {
        check().then(data => {
            if (data) {
                user.setUser(data)
            }
        })
    }, [])

    return (
        <Card className="p-3" bg="dark" text="white" style={{ width: '25rem', margin: '20px auto' }}>
            <Card.Header as="h3">User Profile</Card.Header>
            <Card.Img variant="top" src={`https://avatar.iran.liara.run/public/boy?username=${user.user.firstName}`}  />
            <div>
                <Button onClick={() => {
                    setEditModalVisible(true)
                }} variant="warning" className="m-2">Edit</Button>
            </div>
            <Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item variant="dark"><strong>Email:</strong> {user.user.email}</ListGroup.Item>
                    <ListGroup.Item variant="dark"><strong>First Name:</strong> {user.user.firstName}</ListGroup.Item>
                    <ListGroup.Item variant="dark"><strong>Last Name:</strong> {user.user.lastName}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
            <p><ChangePasswordForm/></p>
            <EditProfileForm show={editModalVisible}
                             onHide={() => setEditModalVisible(false)}/>
        </Card>
    )
})

export default UserProfile
