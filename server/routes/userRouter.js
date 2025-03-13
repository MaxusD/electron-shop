const Router = require('express')
const router = new Router()
const userController = require('../controller/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.put('/change-password', userController.changePassword)
router.put('/update-profile', userController.updateProfile)

module.exports = router