import React, {useState} from 'react'
import {observer} from "mobx-react-lite"
import {Button, Card, Container, ListGroup, Modal, Form} from "react-bootstrap"
import cartStore from "../store/CartStore"
import axios from "axios"
import styles from '../scss/CartItem.module.scss'
import SuccessAlert from "../components/modals/SuccessAlert.tsx"


const CartPage = observer(({}) => {
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState('')


    const handleSendEmail = async () => {
        const orderDetails = cartStore.cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            img: process.env.REACT_APP_API_URL + item.img
        }))

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}api/user/send-order`, {
                email,
                order: orderDetails
            })

            setShowModal(false)
            // alert("Order email sent!")
            setShowSuccess(true)
            setError('')
        } catch (error) {
            console.error("Failed to send email:", error)
            alert("Error sending email")
        }
    }


    return (
        <Container className="mt-3">
            <h2>Shopping Cart</h2>
            {cartStore.cart.length === 0 ? (
                <h4>Your cart is empty</h4>
            ) : (
                <>
                    <ListGroup>
                        {cartStore.cart.map((item: any) => (
                            <ListGroup.Item key={item.id} className={styles.item}>
                                <div>
                                    <img src={process.env.REACT_APP_API_URL + item.img} className={styles.item__image}/>
                                </div>
                                <div className={styles.item__info}>
                                    <div className={styles['item__info-name']}><strong>{item.name}</strong></div>
                                </div>
                                <div className={styles['item__info-price']}>
                                    {item.price} UAH
                                </div>
                                <div className={styles.item__controls}>
                                    <div className={styles['item__controls-row']}>
                                        <span className={styles['item__controls-label']}>Quantity:</span>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => cartStore.decreaseQuantity(item.id)}
                                            disabled={item.quantity <= 1}
                                        >−</Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => cartStore.increaseQuantity(item.id)}
                                        >+</Button>
                                    </div>

                                    <Button variant="danger" onClick={() => cartStore.removeFromCart(item.id)}>
                                        Remove
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Card className="mt-3 p-3">
                        <h4>Total Items: {cartStore.totalItems}</h4>
                        <h4>Total
                            Price: {cartStore.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} UAH</h4>
                        <Button variant="outline-danger" onClick={() => cartStore.clearCart()} className="mt-2">
                            Clear Cart
                        </Button>
                    </Card>
                    <Button variant="success" className="mt-3" onClick={() => setShowModal(true)}>
                        Order
                    </Button>

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm your order</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Please, type your email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleSendEmail}>
                                Send
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <SuccessAlert message="Order email successfully sent!" show={showSuccess}
                                  onClose={() => setShowSuccess(false)}/>
                </>
            )}
        </Container>
    )
})

export default CartPage
