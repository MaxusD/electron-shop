import {observer} from 'mobx-react-lite'
import React, {useContext, useEffect, useState} from "react"
import {Context} from "../main"
import {Button, Table} from "react-bootstrap"
import axios from "axios"
import SuccessAlert from "./modals/SuccessAlert"
import {fetchTypes} from "../http/deviceAPI"
import EditTypeForm from "./modals/EditTypeForm";

const AdminTypeList = observer(() => {
    const { device } = useContext(Context)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedType, setSelectedType] = useState(null)
    const [sortConfig, setSortConfig] = useState({key: "id", direction: "asc"})
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const updateTypes = async () => {
        try {
            const data = await fetchTypes()
            device.setTypes(data)
        } catch (error) {
            console.error("Error fetching types:", error)
        }
    }

    useEffect(() => {
        updateTypes()
    }, [])

    const sortedTypes = [...device.types].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
    })

    const deleteType = async (id) => {
        try {
            setLoading(true)
            await axios.delete(`/api/type/${id}`, {withCredentials: true})
            device.setTypes(device.types.filter((type) => type.id !== id))
            setShowSuccess(true)
            setError('')
        } catch (error) {
            console.error("Failed to delete type", error)
        } finally {
            setLoading(false)
        }
    }

    const requestSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({key, direction})
    }

    const handleUpdateType = (updatedType) => {
        device.setTypes(
            device.types.map((type) => (type.id === updatedType.id ? updatedType : type))
        )
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    return (
        <div className="container">
            <div className="total">Total Types: {device.types.length}</div>
            <h2>Types Management</h2>
            <Table striped>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('id')} style={{cursor: "pointer"}}>
                            # {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th onClick={() => requestSort('name')} style={{cursor: "pointer"}}>
                            Title {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {sortedTypes.map((data) =>
                    <tr key={data.id}
                        className="align-items-center align-middle mb-3"
                        style={{ width: '100%' }}>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td><Button onClick={() => deleteType(data.id)} variant="outline-danger" disabled={loading}>
                            Delete
                        </Button>
                            <Button onClick={() => { setSelectedType(data); setEditModalVisible(true); }} variant="warning" className="ms-2">
                                Edit
                            </Button>
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
            <EditTypeForm
                show={editModalVisible}
                onHide={() => setEditModalVisible(false)}
                type={selectedType}
                onUpdate={handleUpdateType}
            />
        </div>
    )
})

export default AdminTypeList