import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap"
import cartStore from "../store/cartStore"
import {useParams} from 'react-router-dom'
import {fetchOneDevice} from "../http/deviceAPI"
import StarRating from "../components/StarRating";

const DevicePage: React.FC = () => {
    const [device, setDevice] = useState({info: []})
    const {id} = useParams()

    useEffect(() => {
        fetchOneDevice(id).then(data => setDevice(data))
    }, [])
    return (
        <Container className="mt-3">
            <Row className="d-flex align-items-stretch">
                <Col md={4} className="d-flex">
                    <Image
                        className="img-fluid mx-auto"
                        style={{maxHeight:"300px", objectFit:"contain"}}
                        src={process.env.REACT_APP_API_URL + device.img}
                    />
                </Col>
                <Col md={4}>
                    <Row>
                        <h2 className="text-center">{device.name}</h2>
                        <div style={{fontSize: "2rem"}}>
                            <StarRating rating={device.rating} />
                            <div>{device.rating}</div>
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
                {device.info.map((info, index) =>
                    <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    )
}

export default DevicePage
