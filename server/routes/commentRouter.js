const Router = require('express')
const router = new Router()
const commentController = require('../controller/commentController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/add', authMiddleware, commentController.addComment)
router.get('/:deviceId', commentController.getComments)

module.exports = router