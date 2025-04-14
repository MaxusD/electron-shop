import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap"
import cartStore from "../store/CartStore"
import {useParams} from 'react-router-dom'
import {fetchOneDevice} from "../http/deviceAPI"
import StarRating from "../components/StarRating"
import axios from "axios"
import Comments from "../components/Comments"
import {jwtDecode, JwtPayload} from "jwt-decode"
import SuccessAlert from "../components/modals/SuccessAlert.tsx"

interface InfoItem {
    id: number
    title: string
    description: string
}

interface Device {
    id: number,
    name: string,
    img: string,
    price: number,
    rating: number,
    info: InfoItem[]
}

interface DevicePageProps {
    deviceStore: object
}

interface CustomJwtPayload extends JwtPayload {
    id: number,
    email: string,
    role: 'admin' | 'user'
}


const DevicePage: React.FC<DevicePageProps> = ({deviceStore}) => {
    const [device, setDevice] = useState<Device>({price: 0, name: "", id: 0, img: "", rating: 0, info: []})
    const {id} = useParams()
    const [userRating, setUserRating] = useState<Device | null>(null)
    const [rated, setRated] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const token = localStorage.getItem("token")
    const decoded = token ? jwtDecode<CustomJwtPayload>(token) : null
    const userId = decoded?.id || null

    useEffect(() => {
        fetchOneDevice(id).then(data => setDevice(data))
        if (!userId || !device.id)
            return
    }, [device.id, userId])

    const handleRatingChange = async (newRating: number) => {
        if (rated) {
            return
        }

        setRated(true)
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/device/rate`, {
                    userId,
                    deviceId: device.id,
                    rating: newRating
                }, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                }
            )
            setShowSuccess(true)
            setUserRating(response.data.avgRating)
            deviceStore.updateDeviceRating(device.id, response.data.avgRating)
        // } catch (error) {
        //     if (error.response && error.response.status === 400) {
        //         alert(error.response.data.message)
        //     }
        //     console.error("Error submitting rating:", error)
        //     setRated(false)
        // }
        } catch (error) {
            if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object') {
                const response = error.response as { status?: number, data?: { message?: string } }
                if (response.status === 400 && response.data?.message) {
                    alert(response.data.message)
                }
            }
        }
    }

    return (
        <>
            <Container className="mt-3">
                <Row className="d-flex align-items-stretch">
                    <Col md={4} className="d-flex">
                        <Image
                            className="img-fluid mx-auto"
                            style={{maxHeight: "300px", objectFit: "contain"}}
                            src={process.env.REACT_APP_API_URL + device.img}
                        />
                    </Col>
                    <Col md={4}>
                        <Row>
                            <h2 className="text-center">{device.name}</h2>
                            <div style={{fontSize: "2rem"}} className="d-flex justify-content-center">
                                <StarRating key={device.rating} rating={device.rating}
                                            onRatingChange={handleRatingChange}
                                            disabled={rated}/>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <div>{(device?.rating || 0).toFixed(1)}</div>
                            </div>
                        </Row>
                    </Col>
                    <Col md={4} className="d-flex">
                        <Card
                            className="d-flex flex-column align-items-center justify-content-center w-100 p-4 border-light shadow-sm"
                            style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
                        >
                            <h3>From: {device.price} UAH</h3>
                            <Button variant={"outline-dark"}
                                    onClick={() => cartStore.addToCart(device)}
                            >
                                Add to cart
                            </Button>
                        </Card>
                    </Col>
                </Row>
                <Row className="d-flex flex-column m-3">
                    <h1>Характеристики</h1>
                    {device.info.map((info: any, index: number) =>
                        <Row key={info.id}
                             style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                            {info.title}: {info.description}
                        </Row>
                    )}
                </Row>
                <Row>
                    <Comments deviceId={device.id} userId={userId ?? 0}/>
                </Row>
            </Container>
            <SuccessAlert message="Rating has been successfully updated!" show={showSuccess}
                          onClose={() => setShowSuccess(false)}/>
        </>
    )
}

export default DevicePage
