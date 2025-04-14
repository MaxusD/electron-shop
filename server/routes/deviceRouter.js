const Router = require('express')
const router = new Router()
const deviceController = require('../controller/deviceController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.delete('/:id', deviceController.delete)
router.put('/:id', deviceController.update)
router.post('/rate', deviceController.rateDevice)

module.exports = router