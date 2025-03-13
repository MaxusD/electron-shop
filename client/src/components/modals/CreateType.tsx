import React, {useState} from 'react'
import {Button, Form, Modal} from "react-bootstrap"
import {createType} from "../../http/deviceAPI"
import SuccessAlert from "./SuccessAlert"

const CreateType = ({show, onHide}) => {
    const [value, setValue] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')
    const addType = async () => {
        if (!value.trim()) {
            setError('Type can not be empty')
            return
        }

        try {
            const response = await createType({name: value})
            if (response && response.id) {
                setValue('')
                onHide()
                setShowSuccess(true)
                setError('')
            } else {
                throw new Error('Failed to create brand')
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Error adding type')
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
                        Add New Type
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder={"Type Name of Type"}
                        />
                        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Close</Button>
                    <Button variant="outline-success" onClick={addType}>Add</Button>
                </Modal.Footer>
            </Modal>

            <SuccessAlert message="Type successfully added!" show={showSuccess} onClose={() => setShowSuccess(false)}/>
        </>
    )
}

export default CreateType
