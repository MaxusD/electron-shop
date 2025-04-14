import {useContext} from 'react'
import {observer} from "mobx-react-lite"
import {Context} from "../main"
import {Col, Row} from "react-bootstrap"
import DeviceItem from "./DeviceItem"

const DeviceList = observer(() => {
    const {device} = useContext(Context)

    return (
        <Row className="d-flex">
            {device.devices.map(device =>
                <Col key={device.id} md={4} className="d-flex mt-3">
                    <DeviceItem device={device}/>
                </Col>
            )}
        </Row>
    )
})

export default DeviceList
