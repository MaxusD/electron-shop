import {useEffect, useState} from 'react'
import {Button, Card, Image} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {DEVICE_ROUTE} from "../utils/consts"
import StarRating from "./StarRating"
import axios from "axios"
import {jwtDecode} from "jwt-decode"

const DeviceItem = ({device, deviceStore/*, userId*/}) => {
    const navigate = useNavigate()
    const [userRating, setUserRating] = useState(device.rating)
    const [rated, setRated] = useState(false)

    const token = localStorage.getItem("token")
    const userId = token ? jwtDecode(token).id : null


    useEffect(() => {
        if (!userId || !device.id) return

        axios.get(`${process.env.REACT_APP_API_URL}api/ratings?userId=${userId}&deviceId=${device.id}`)
            .then(res => {
                //setRated(true)
                //setUserRating(res.data.userRating)
            })
            .catch(err => console.error("Error fetching rating:", err))
    }, [device.id, userId])

    const handleRatingChange = async (newRating: number) => {
        if (rated) return
        console.log("Попытка отправки рейтинга:", { userId, deviceId: device.id, rating: newRating })
        setRated(true)
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}api/device/rate`, {
                userId,
                deviceId: device.id,
                rating: newRating
            }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            )
            //alert(response.data.message)
            //setUserRating(response.data.avgRating)
            deviceStore.updateDeviceRating(device.id, response.data.avgRating)
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message)
            } /*else {
                console.error("Error submitting rating:", error)
                alert("Ошибка при отправке рейтинга")
            }*/
            console.error("Error submitting rating:", error)
            setRated(false)
        }
    }

    return (
        <Card
            onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
            className="d-flex flex-column justify-content-between p-3 w-100 border-light shadow-sm"
            style={{minHeight: "100%", cursor: 'pointer'}}
        >
            <Image src={process.env.REACT_APP_API_URL + device.img} className="img-fluid"
                   style={{objectFit: "contain", maxHeight: "200px"}}/>
            <h5 className="mt-3 text-center">{device.name}</h5>
            <div className="d-flex justify-content-center">
                {/*<StarRating key={userRating} rating={userRating} onRatingChange={handleRatingChange} disabled={rated} />*/}
                <StarRating rating={device.rating} disabled={true}/>
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <div>{userRating.toFixed(1)}</div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-auto">
                <span>{device.price} UAH</span>
                <Button variant="outline-dark">Add to cart</Button>
            </div>
        </Card>

    )
}

export default DeviceItem
