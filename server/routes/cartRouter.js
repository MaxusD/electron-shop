const Router = require('express')
const router = new Router()

const cartController = require('../controller/cartController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, cartController.getCart)
router.post('/', authMiddleware, cartController.addToCart)
router.delete('/device/:id', authMiddleware, cartController.removeFromCart)
router.delete('/clear', authMiddleware, cartController.clearCart)
router.post('/decrease', authMiddleware, cartController.decreaseQuantity)


module.exports = router