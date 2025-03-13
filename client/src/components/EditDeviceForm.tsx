import React, {useEffect, useState} from 'react'
import axios from "axios"
import {Button, Form, Modal, Spinner} from "react-bootstrap"
import {fetchOneDevice} from "../http/deviceAPI"
import SuccessAlert from "./modals/SuccessAlert"
import DeviceInfoForm from "./modals/DeviceInfoForm"
import {v4 as uuidv4} from 'uuid'


const EditDeviceForm = ({show, onHide, device}) => {
    const [name, setName] = useState<string>(device?.name || '')
    const [price, setPrice] = useState<string>(device?.price || '')
    const [info, setInfo] = useState<{ title: string; description: string }[]>(device?.info || [])
    const [image, setImage] = useState<File>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(device?.img ? `/uploads/${device.img}` : null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (device) {
            fetchOneDevice(device?.id).then((data) => {
                setName(data.name || '')
                setPrice(data.price || '')
                if (Array.isArray(data.info)) {
                    setInfo(
                        data.info.map((item) => ({
                            number: uuidv4(),
                            title: item.title,
                            description: item.description
                        }))
                    )
                }
                setImagePreview(device.img ? process.env.REACT_APP_API_URL +`/${device.img}` : null)
            })
        }
    }, [device])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }


    const updateDevice = async () => {

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("name", name)
            formData.append("price", price)
            formData.append("info", JSON.stringify(info))
            if (image) {
                formData.append("img", image)
            }
            await axios.put(`/api/device/${device.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            onHide()
            setShowSuccess(true)
            setError('')
        } catch (e) {
            console.error('Filed to update device', e)
            setError("Failed to update device")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border"/>
                        </div>
                    ) : (
                        <Form>
                            <Form.Group className="mt-3">
                                <Form.Label>Current Image</Form.Label>
                                {imagePreview && <img src={imagePreview} alt="Device" style={{ width: '100px', display: 'block', marginBottom: '10px' }} />}
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Upload New Image</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>


                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Characteristics</Form.Label>
                                <hr/>
                                <DeviceInfoForm info={info} setInfo={setInfo}/>
                            </Form.Group>

                        </Form>
                    )}
                    {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Close</Button>
                    <Button variant="outline-success" onClick={updateDevice} disabled={loading}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            <SuccessAlert message="Device has been successfully updated!" show={showSuccess}
                          onClose={() => setShowSuccess(false)}/>
        </>
    )

}

export default EditDeviceForm
