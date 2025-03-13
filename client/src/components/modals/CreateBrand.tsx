import React, {useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap"
import {createBrand} from "../../http/deviceAPI"
import SuccessAlert from "./SuccessAlert"

const CreateBrand = ({show, onHide}) => {
    const [value, setValue] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')

    const addBrand = async () => {
        if (!value.trim()) {
            setError('Brand can not be empty')
            return
        }

        try {
            const response = await createBrand({name: value})
            if (response && response.id) {
                setValue('')
                onHide()
                setShowSuccess(true)
                setError('')
            } else {
                throw new Error('Failed to create brand')
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Error adding brand')
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add New Brand
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="Type Name of Brand"
                        />
                        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Close</Button>
                    <Button variant="outline-success" onClick={addBrand}>Add</Button>
                </Modal.Footer>
            </Modal>
            <SuccessAlert message="Brand has been successfully added!" show={showSuccess} onClose={() => setShowSuccess(false)} />
        </>
    )
}

export default CreateBrand
