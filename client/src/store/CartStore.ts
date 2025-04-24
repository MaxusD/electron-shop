import {makeAutoObservable} from 'mobx'
import axios from "axios"

interface CartItem {
    id: number
    price: number
    quantity: number
    name: string
    img: string
}

class CartStore {
    cart: CartItem[] = []

    constructor() {
        makeAutoObservable(this)
    }

    get totalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0)
    }

    get totalPrice() {
        return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    private getAuthHeaders() {
        const token = localStorage.getItem('token')
        return {
            Authorization: `Bearer ${token}`
        }
    }

    async loadUserCart() {
        try {
            const { data } = await axios.get('/api/cart', {
                headers: this.getAuthHeaders()
            })
            this.cart = data
        } catch (error) {
            console.error("Error during load the cart", error)
        }
    }

    async addToCart(device: any) {
        try {
            await axios.post('/api/cart', {
                deviceId: device.id,
                quantity: 1
            }, {
                headers: this.getAuthHeaders()
            })

            await this.loadUserCart()
        } catch (error) {
            console.error("Error during adding to the cart", error)
        }
    }

    async removeFromCart(id: number) {
        try {
            await axios.delete(`/api/cart/device/${id}`, {
                headers: this.getAuthHeaders()
            })

            await this.loadUserCart()
        } catch (error) {
            console.error("Error during delete the cart", error)
        }
    }

    async clearCart() {
        const ids = this.cart.map(item => item.id)
        for (const id of ids) {
            await this.removeFromCart(id)
        }
    }

    async increaseQuantity(deviceId: number) {
        try {
            await axios.post('/api/cart', {
                deviceId,
                quantity: 1
            }, {
                headers: this.getAuthHeaders()
            });
            await this.loadUserCart()
        } catch (error) {
            console.error('Error when increasing quantity', error)
        }
    }

    async decreaseQuantity(deviceId: number) {
        try {
            await axios.post('/api/cart/decrease', {
                deviceId
            }, {
                headers: this.getAuthHeaders()
            })
            await this.loadUserCart()
        } catch (error) {
            console.error('Error when decreasing quantity', error)
        }
    }


}
export default new CartStore()
