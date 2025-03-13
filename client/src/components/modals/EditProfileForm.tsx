import React, {useContext, useState} from 'react'
import {Context} from "../../main"
import {Alert, Button, Form, Modal, Spinner} from "react-bootstrap"
import {updateProfile} from "../../http/userAPI"
import SuccessAlert from "./SuccessAlert"

const EditProfileForm = ({show, onHide}) => {
    const {user} = useContext(Context)
    const [showSuccess, setShowSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState<string>(user.user.firstName || '')
    const [lastName, setLastName] = useState<string>(user.user.lastName || '')
    const [error, setError] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const updatedUser = await updateProfile(user.user.id, {firstName, lastName})
            user.setUser(updatedUser)
            onHide()
            setShowSuccess(true)
            setError('')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border"/>
                        </div>
                    ) : (
                        <Form>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Form>
                    )}
                    {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Close</Button>
                    <Button variant="outline-success" onClick={handleSubmit} disabled={loading}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            <SuccessAlert message="User has been successfully updated!" show={showSuccess}
                          onClose={() => setShowSuccess(false)}/>
        </>
    )
}

export default EditProfileForm
