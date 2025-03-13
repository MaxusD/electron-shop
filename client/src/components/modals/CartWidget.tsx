import React, {useState} from 'react'
import {Button, ListGroup, Modal} from "react-bootstrap"
import {observer} from "mobx-react-lite"
import cartStore from "../../store/CartStore"
import {Link} from "react-router-dom"

const CartWidget: React.FC = observer(() => {

    const [show, setShow] = useState(false)

    if (cartStore.cart.length === 0) return null

    return (
        <>
            <Button
                className="btn-cart"
                variant="primary"
                onClick={() => setShow(true)}
            >
                🛒
                <div className="icon-quantity-wrapper">
                    {cartStore.totalItems}
                </div>
            </Button>

            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Shopping Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cartStore.cart.length === 0 ? (
                        <p>Cart is empty.</p>
                    ) : (
                        <ListGroup>
                            {cartStore.cart.map((item) => (
                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                    {item.name} - {item.price} UAH
                                    <Button variant="danger" size="sm" onClick={() => cartStore.removeFromCart(item.id)}>
                                        ❌
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <strong>Total: {cartStore.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} UAH</strong>
                    <Link to="/cart">
                        <Button variant="success" onClick={() => setShow(false)}>
                            Cart
                        </Button>
                    </Link>
                </Modal.Footer>
            </Modal>
        </>
    )
})

export default CartWidget
