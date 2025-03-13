const Router = require('express')
const router = new Router()
const typeController = require('../controller/typeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)
router.delete('/:id', typeController.delete)
router.put('/:id', typeController.update)

module.exports = router