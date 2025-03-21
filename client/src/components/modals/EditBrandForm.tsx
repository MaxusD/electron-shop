import React, {useEffect, useState} from 'react'
import axios from "axios"
import {Button, Form, Modal, Spinner} from "react-bootstrap"
import SuccessAlert from "./SuccessAlert"

const EditBrandForm = ({show, onHide, onUpdate, brand}) => {
    const [name, setName] = useState<string>(brand?.name || '')
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (brand && brand.id) {
            setName(brand.name || '')
        }
    }, [brand])

    const updateBrand = async () => {

        try {
            setLoading(true)
            const response = await axios.put(`${process.env.REACT_APP_API_URL}api/brand/${brand.id}`, { name },  { headers: { 'Content-Type': 'application/json' }})

            if (onUpdate) {
                onUpdate(response.data)
            }

            onHide()
            setShowSuccess(true)
            setError('')
        } catch (e) {
            console.log('Filed to update brand', e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Brand</Modal.Title>
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
                    <Button variant="outline-success" onClick={updateBrand} disabled={loading}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            <SuccessAlert message="Brand has been successfully updated!" show={showSuccess}
                          onClose={() => setShowSuccess(false)}/>
        </>
    )
}

export default EditBrandForm
