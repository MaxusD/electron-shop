import {useContext, useEffect, useState} from 'react'
import {Button, Dropdown, DropdownMenu, DropdownToggle, Form, Modal} from "react-bootstrap"
import {Context} from "../../main"
import {createDevice, fetchBrands, fetchTypes} from "../../http/deviceAPI"
import {observer} from "mobx-react-lite"
import DeviceInfoForm from "./DeviceInfoForm"
import SuccessAlert from "./SuccessAlert"

const CreateDevice = observer(({show, onHide}) => {
    const {device} = useContext(Context)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)


    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
    }, [])

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addDevice = () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', `${price}`)
        formData.append('img', file)
        formData.append('brandId', device.selectedBrand.id)
        formData.append('typeId', device.selectedType.id)
        formData.append('info', JSON.stringify(info))
        createDevice(formData).then(data => onHide())
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
                        Add New Device
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Dropdown className="mt-2 mb-2">
                            <DropdownToggle>{device.selectedType.name || "Choose type"}</DropdownToggle>
                            <DropdownMenu>
                                {device.types.map(type =>
                                    <Dropdown.Item
                                        onClick={() => device.setSelectedType(type)}
                                        key={type.id}>
                                        {type.name}
                                    </Dropdown.Item>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown className="mt-2 mb-2">
                            <DropdownToggle>{device.selectedBrand.name || "Choose brand"}</DropdownToggle>
                            <DropdownMenu>
                                {device.brands.map(brand =>
                                    <Dropdown.Item
                                        onClick={() => device.setSelectedBrand(brand)}
                                        key={brand.id}>{brand.name}
                                    </Dropdown.Item>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                        <Form.Control
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="mt-3"
                            placeholder="Type name of device"
                        />
                        <Form.Control
                            value={price}
                            onChange={e => setPrice(Number(e.target.value))}
                            className="mt-3"
                            placeholder="Type price of device"
                            type="number"
                        />
                        <Form.Control
                            className="mt-3"
                            type="file"
                            onChange={selectFile}
                        />
                        <Form.Label className="mt-3">Characteristics</Form.Label>
                        <hr/>
                        <DeviceInfoForm info={info} setInfo={setInfo}/>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={onHide}>Close</Button>
                    <Button variant="outline-success" onClick={addDevice}>Add</Button>
                </Modal.Footer>
            </Modal>
            <SuccessAlert message="Device has been successfully added!" show={showSuccess} onClose={() => setShowSuccess(false)}/>
        </>
    )
})

export default CreateDevice
