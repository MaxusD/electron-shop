import {observer} from "mobx-react-lite"
import {Button, Table} from "react-bootstrap"
import SuccessAlert from "./modals/SuccessAlert"
import {useContext, useEffect, useState} from "react"
import {Context} from "../main"
import axios from "axios"
import EditBrandForm from "./modals/EditBrandForm"
import {fetchBrands} from "../http/deviceAPI"


const AdminBrandList = observer(() => {

    const {device} = useContext(Context)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState<{id: number; name: string} | null>(null)
    const [sortConfig, setSortConfig] = useState({key: "id", direction: "asc"})
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const updateBrands = async () => {
        try {
            const data = await fetchBrands()
            device.setBrands(data)
        } catch (error) {
            console.error("Error fetching types:", error)
        }
    }

    useEffect(() => {
        updateBrands()
    }, [])


    const sortedBrands = [...device.brands].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
    })

    const requestSort = (key: string) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({key, direction})
    }

    const deleteBrand = async (id: number) => {
        try {
            setLoading(true)
            await axios.delete(`${process.env.REACT_APP_API_URL}api/brand/${id}`, {withCredentials: true})
            device.setBrands(device.brands.filter((brand: { id: number }) => brand.id !== id))
            setShowSuccess(true)
            setError('')
        } catch (error) {
            console.error("Failed to delete brand", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateBrand = (updatedBrand: { id: number }) => {
        device.setBrands(
            device.brands.map((brand: { id: number }) => (brand.id === updatedBrand.id ? updatedBrand : brand))
        )
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    return (
        <div className="container">
            <div className="total">Total Brands: {device.brands.length}</div>
            <h2>Brands Management</h2>
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
                {sortedBrands.map((data) =>
                    <tr key={data.id}
                        className="align-items-center align-middle mb-3"
                        style={{width: '100%'}}>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td><Button onClick={() => deleteBrand(data.id)} variant="outline-danger" disabled={loading}>
                            Delete
                        </Button>
                            <Button onClick={() => {
                                setSelectedBrand(data);
                                setEditModalVisible(true);
                            }} variant="warning" className="ms-2">
                                Edit
                            </Button>
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
            <EditBrandForm
                show={editModalVisible}
                onHide={() => setEditModalVisible(false)}
                brand={selectedBrand}
                onUpdate={handleUpdateBrand}
            />
            {showSuccess && <SuccessAlert message="Brand updated successfully!" onClose={() => setShowSuccess(false)}
                                          show={false} />}
        </div>
    )
})

export default AdminBrandList
