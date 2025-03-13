const Router = require('express')

const router = new Router()
const userController = require('../controller/user.controller')

router.post('/user', userController.createUser)
router.get('/user', userController.getUsers)
router.get('/users-cart', userController.getUserCart)
router.get('/user-cart-id/:id', userController.getUserCartById)
router.delete('/user/:id', userController.deleteUser)

module.exports = router