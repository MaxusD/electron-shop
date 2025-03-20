import React, {useEffect, useState} from 'react'
import {Button, Form, Modal, Spinner} from "react-bootstrap"
import axios from "axios"
import SuccessAlert from "./SuccessAlert"

const EditTypeForm = ({show, onHide, type, onUpdate}) => {
    const [name, setName] = useState<string>(type?.name || '')
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (type) {
            setName(type.name || '')
        }
    }, [type])

    const updateType = async () => {

        try {
            setLoading(true)
            console.log('BEFORE UPDATE')
            const response = await axios.put(`/type/${type.id}`, { name }, { headers: { 'Content-Type': 'application/json' }})
            console.log('AFTER UPDATE')
            if (onUpdate) {
                onUpdate(response.data)
            }

            onHide()
            setShowSuccess(true)
            setError('')
        } catch (e) {
            console.log('Filed to update type', e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border"/>
                        </div>
                    ) : (
                        <Form>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    )}
                    {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Close</Button>
                    <Button variant="outline-success" onClick={updateType} disabled={loading}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            <SuccessAlert message="Type has been successfully updated!" show={showSuccess}
                          onClose={() => setShowSuccess(false)}/>
        </>
    )
}
export default EditTypeForm
 