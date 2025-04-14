const {User, Comment, Rating} = require("../models/models")

class CommentController {

    async addComment(req, res) {

        try {
            const {deviceId, text} = req.body
            const userId = req.user?.id

            if (!userId) {
                return res.status(401).json({message: "You do not login!!!"})
            }

            const comment = await Comment.create({userId, deviceId, text})

            const commentWithUserName = await Comment.findOne({
                where: {id: comment.id},
                include: [{model: User, as: 'user', attributes: ['firstName', 'lastName']}]
            })

            return res.json(commentWithUserName)
        } catch (error) {
            console.error("Error creating comment:", error)
            return res.status(500).json({message: "Error creating comment"})
        }
    }

    async getComments(req, res) {
        try {
            const {deviceId} = req.params
            const { page = 1, limit = 5 } = req.query
            const offset = (page - 1) * limit

            const { count, rows } = await Comment.findAndCountAll({
                where: {deviceId},
                include: [
                    {
                        model: User,
                        attributes: ['firstName', 'lastName']
                    },
                    {
                        model: Rating,
                        where: {deviceId},
                        required: false
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
            return res.json({
                comments: rows,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page)
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "Error creating comment"})
        }
    }
}

module.exports = new CommentController()