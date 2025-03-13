const Router = require('express')
const router = new Router()
const brandController = require('../controller/brandController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)
router.delete('/:id', brandController.delete)
router.put('/:id', brandController.update)

module.exports = router