import React from 'react'
import {observer} from "mobx-react-lite"
import {Button, Card, Container, ListGroup} from "react-bootstrap"
import cartStore from "../store/CartStore"


const CartPage: React.FC = observer(() => {
    return (
        <Container className="mt-3">
            <h2>Shopping Cart</h2>
            {cartStore.cart.length === 0 ? (
                <h4>Your cart is empty</h4>
            ) : (
                <>
                    <ListGroup>
                        {cartStore.cart.map((item: any) => (
                            <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                   <img src={process.env.REACT_APP_API_URL + item.img} height={200}/>
                                </div>
                                <div>
                                    <strong>{item.name}</strong> - {item.price} UAH
                                    <br />
                                    Quantity: {item.quantity}
                                </div>
                                <Button variant="danger" onClick={() => cartStore.removeFromCart(item.id)}>
                                    Remove
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Card className="mt-3 p-3">
                        <h4>Total Items: {cartStore.totalItems}</h4>
                        <h4>Total Price: {cartStore.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} UAH</h4>
                        <Button variant="outline-danger" onClick={() => cartStore.clearCart()} className="mt-2">
                            Clear Cart
                        </Button>
                    </Card>
                </>
            )}
        </Container>
    )
})

export default CartPage
