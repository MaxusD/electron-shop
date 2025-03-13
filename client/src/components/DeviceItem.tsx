import React from 'react'
import {Button, Card, Col, Image} from "react-bootstrap"
import star from "../assets/star.png"
import {useNavigate} from "react-router-dom"
import {DEVICE_ROUTE} from "../utils/consts"
import StarRating from "./StarRating";

const DeviceItem = ({device}) => {
    const navigate = useNavigate()

    return (
        // <Col md={3} className="mt-3" onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}>
        //     <Card style={{width: "auto", cursor: 'pointer', border: 'light'}} className="mt-2">
        //         <Image width={140} height={140} src={process.env.REACT_APP_API_URL + device.img} style={{margin: "0 auto"}}/>
        //         <div className="text-black-50 d-flex justify-content-between align-items-center mt-2">
        //             <div><strong>{device.name}</strong></div>
        //         <div className="d-flex align-items-center">
        //             <div>{device.rating}</div>
        //                 <Image width={18} height={18} src={star}/>
        //             </div>
        //         </div>
        //         <div>{device.price} <span>UAH</span></div>
        //     </Card>
        // </Col>
        <Card
            onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
            className="d-flex flex-column justify-content-between p-3 w-100 border-light shadow-sm"
            style={{minHeight: "100%", cursor: 'pointer'}}
        >
            <Image src={process.env.REACT_APP_API_URL + device.img} className="img-fluid"
                   style={{objectFit: "contain", maxHeight: "200px"}}/>
            <h5 className="mt-3 text-center">{device.name}</h5>
            <div className="d-flex justify-content-center">
                <StarRating rating={device.rating}/*onRatingChange={(rating) => console.log("Выбранный рейтинг:", rating)}*//>
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <div>{device.rating}</div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-auto">
                <span>{device.price} UAH</span>
                <Button variant="outline-dark">Add to cart</Button>
            </div>
        </Card>

    )
}

export default DeviceItem
