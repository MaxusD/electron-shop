const {Brand, Type} = require('../models/models')
const ApiError = require('../error/ApiError')
class BrandController {
    async create(req, res) {
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async update(req, res, next) {
        const { id } = req.params
        const { name } = req.body

        console.log('Получен запрос на обновление:', { id, name })

        try {
            const [updated] = await Brand.update(
                { name },
                { where: { id: id } }
            )

            if (updated === 0) {
                return next(ApiError.badRequest('Type not found'))
            }

            const brand = await Brand.findOne({ where: { id: id } })

            return res.json(brand)

        } catch (e) {
            return next(ApiError.internal('Failed to update brand'))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const brand = await Brand.findByPk(id)

            if (!brand) {
                return res.status(404).json({message: 'Brand not found'})
            }

            await brand.destroy()
            return res.json({message: "Brand deleted successfully"})
        } catch (error) {
            next(ApiError.internal("Filed to delete brand"))
        }
    }

}

module.exports = new BrandController()