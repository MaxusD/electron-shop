const {Cart,CartDevice, Device} = require("../models/models");

class CartController {
    async getCart(req, res) {
        const userId = req.user.id

        const cart = await Cart.findOne({
            where: { userId },
            include: {
                model: CartDevice,
                include: [Device]
            }
        })

        if (!cart) return res.json([])

        const cartItems = cart.cart_devices.map(cd => ({
            id: cd.device.id,
            name: cd.device.name,
            img: cd.device.img,
            price: cd.device.price,
            quantity: cd.quantity
        }))

        res.json(cartItems)
    }

    async addToCart(req, res) {
        const userId = req.user.id
        const { deviceId, quantity = 1 } = req.body

        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId })
        }

        const [cartDevice, created] = await CartDevice.findOrCreate({
            where: { cartId: cart.id, deviceId },
            defaults: { quantity }
        });

        if (!created) {
            cartDevice.quantity += quantity
            await cartDevice.save()
        }

        res.json(cartDevice)
    }

    async removeFromCart(req, res) {
        const userId = req.user.id
        const deviceId = req.params.id

        const cart = await Cart.findOne({ where: { userId } })
        if (!cart) return res.status(404).json({ error: 'Cart not found' })

        await CartDevice.destroy({
            where: { cartId: cart.id, deviceId }
        })

        res.json({ success: true })
    }

    async clearCart(req, res) {
        const userId = req.user.id

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) return res.status(404).json({ error: 'Cart not found' })

        await CartDevice.destroy({
            where: { cartId: cart.id }
        })

        res.json({ success: true })
    }

    async decreaseQuantity(req, res) {
        const userId = req.user.id
        const { deviceId } = req.body

        const cart = await Cart.findOne({ where: { userId } })
        if (!cart) return res.status(404).json({ error: 'Cart not found' })

        const cartDevice = await CartDevice.findOne({
            where: { cartId: cart.id, deviceId }
        })

        if (!cartDevice) return res.status(404).json({ error: 'Item not found' })

        if (cartDevice.quantity > 1) {
            cartDevice.quantity -= 1
            await cartDevice.save()
        }

        res.json(cartDevice)
    }

}

module.exports = new CartController()