import { makeAutoObservable } from 'mobx'

interface CartItem {
    id: number
    price: number
    quantity: number
}

class CartStore {
    //cart = []
    cart: CartItem[] = []

    constructor() {
        makeAutoObservable(this)
        this.loadCart()
    }

    addToCart(device: any) {
        const existingItem = this.cart.find(item => item.id === device.id)
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            this.cart.push({...device, quantity: 1})
        }
        this.saveCart()
    }

    removeFromCart(id: number) {
        this.cart = this.cart.filter(item => item.id !== id)
        this.saveCart()
    }

    clearCart() {
        this.cart = []
        this.saveCart()
    }

    get totalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0)
    }

    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this.cart))
    }

    loadCart() {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            this.cart = JSON.parse(savedCart)
        }
    }
}
export default new CartStore()
