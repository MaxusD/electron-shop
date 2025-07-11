import {useContext, useEffect, useState} from 'react'
import {Button, Container, Form} from "react-bootstrap"
import CreateBrand from "../components/modals/CreateBrand"
import CreateType from "../components/modals/CreateType"
import CreateDevice from "../components/modals/CreateDevice"
import Pages from "../components/Pages"
import AdminDeviceList from "../components/AdminDeviceList"
import {observer} from "mobx-react-lite"
import {Context} from "../main"
import {fetchBrands, fetchDevices, fetchTypes} from "../http/deviceAPI"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import AdminTypeList from "../components/AdminTypeList"
import AdminBrandList from "../components/AdminBrandList"
import UserProfile from "../components/UserProfile"

const Admin = observer(() => {
    const {device} = useContext(Context)
    const [brandVisible, setBrandVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [deviceVisible, setDeviceVisible] = useState(false)
    const [selectedType, setSelectedType] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('')
    const [key, setKey] = useState('devices')

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
        fetchDevices(null, null, 1, 5).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [])

    useEffect(() => {
        fetchDevices(selectedType || null, selectedBrand || null, device.page, device.limit).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [selectedType, selectedBrand, device.page])

    return (
        <Tabs
            id="admin-panel"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 container"
        >
            <Tab eventKey="devices" title="Devices">
                <Container className="d-flex flex-column" style={{minHeight: '100vh'}}>
                    <Button onClick={() => setTypeVisible(true)} variant={"outline-dark"} className="mt-2 p-2">Add
                        type</Button>
                    <Button onClick={() => setBrandVisible(true)} variant={"outline-dark"} className="mt-2 p-2">Add
                        brand</Button>
                    <Button onClick={() => setDeviceVisible(true)} variant={"outline-dark"} className="mt-2 p-2">Add
                        device</Button>


                    <Form.Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mt-2"
                    >
                        <option value="">Select type</option>
                        {device.types.map(type => (
                            <option key={type.id} value={String(type.id)}>{type.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="mt-2"
                    >
                        <option value="">Select brand</option>
                        {device.brands.map(brand => (
                            <option key={brand.id} value={String(brand.id)}>{brand.name}</option>
                        ))}
                    </Form.Select>
                    <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
                    <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
                    <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)}/>
                    <AdminDeviceList/>
                    <Pages/>
                </Container>
            </Tab>
            <Tab eventKey="types" title="Types">
                <AdminTypeList />
            </Tab>
            <Tab eventKey="brands" title="Brands">
                <AdminBrandList />
            </Tab>
            <Tab eventKey="profile" title="Profile">
                <UserProfile />
            </Tab>
        </Tabs>
    )
})


export default Admin
