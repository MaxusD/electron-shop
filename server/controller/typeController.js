const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res) {
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }

    async update(req, res, next) {
        const { id } = req.params
        const { name } = req.body

        try {
            const [updated] = await Type.update(
                { name },
                { where: { id: id } }
            )

            if (updated === 0) {
                return next(ApiError.badRequest('Type not found'))
            }

            const type = await Type.findOne({ where: { id: id } })

            return res.json(type)
        } catch (error) {
            return next(ApiError.internal('Failed to update type'))
        }
    }


    async delete(req, res, next) {
        try {
            const { id } = req.params
            const type = await Type.findByPk(id)

            if (!type) {
                return res.status(404).json({message: 'Type not found'})
            }

            await type.destroy()
            return res.json({message: "Type deleted successfully"})
        } catch (error) {
            next(ApiError.internal("Filed to delete type"))
        }
    }

}

module.exports = new TypeController()