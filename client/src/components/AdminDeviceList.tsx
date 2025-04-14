import {useContext, useEffect, useState} from 'react'
import {fetchDevices} from "../http/deviceAPI"
import {observer} from "mobx-react-lite"
import axios from "axios"
import {Context} from "../main"
import {Button, Table} from "react-bootstrap"
import EditDeviceForm from "./EditDeviceForm"


const AdminDeviceList = observer(() => {
    // @ts-ignore
    const {device} = useContext(Context)

    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState(null)

    useEffect(() => {
        fetchDevices(null, null, 1, 5).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [device.page])



    const deleteDevice = async (id: number) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}api/device/${id}`)
            device.removeDevice(id)
        } catch (e) {
            console.error('Failed to delete device: ', e)
        }
    }

    return (
        <div>
            <div className="total">All devices: {device.totalCount}</div>
            <h2>Device Management</h2>
            <Table striped>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {device.devices?.map((data: any) => (

                                <tr key={data.id}
                                    className="align-items-center align-middle mb-3"
                                    style={{ width: '100%' }}>
                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td><img alt="image" src={process.env.REACT_APP_API_URL + data.img} width={150} height={150} /></td>
                                    <td>{data.price}</td>
                                    <td><Button
                                        variant="outline-danger"
                                        onClick={() => deleteDevice(data.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </Button>
                                        <Button onClick={() => { setSelectedDevice(data); setEditModalVisible(true); }} variant="warning" className="ms-2">
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                ))}
                </tbody>
            </Table>
            <EditDeviceForm
                show={editModalVisible}
                onHide={() => setEditModalVisible(false)}
                device={selectedDevice}
            />
         </div>
    )
})

export default AdminDeviceList
