const uuid = require('uuid')
const path = require('path')
const {Device, Rating, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')
const fs = require("fs")

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            let fileName
            const fallbackImageUrl = 'noimg.jpeg'
            if (req.files && req.files.img) {
                const {img} = req.files
                fileName = uuid.v4() + '.jpg'
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
            } else {
                fileName = fallbackImageUrl
            }
            const device = await Device.create({name, price, brandId, typeId, img: fileName})


            if (info) {
                info = JSON.parse(info)

                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                })
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params
            const {name, price, brandId, typeId, info} = req.body

            const device = await Device.findByPk(id)

            if (!device) {
                return res.status(404).json({message: 'Device not found'})
            }

            let fileName = device.img
            if (req.files && req.files.img) {
                const {img} = req.files
                fileName = uuid.v4() + '.jpg'
                img.mv(path.resolve(__dirname, '..', 'static', fileName))

                if (device.img !== 'noimg.jpeg') {
                    fs.unlink(path.resolve(__dirname, '..', 'static', device.img), (err) => {
                        if (err) console.error('Error deleting message:', err)
                    })
                }
            }


        await device.update({name, price, brandId, typeId, img: fileName})

            if (info) {
            const parsedInfo = Array.isArray(info) ? info : JSON.parse(info)

            await DeviceInfo.destroy({where: {deviceId: id}})

            await Promise.all(
                parsedInfo.map(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: id,
                    })
                )
            )
        }

        return res.json({message: 'Device updated successfully'})
    }

    catch(e) {
        return next(ApiError.internal('Something went wrong while updating the device'))
    }
    }

async delete (req, res) {
    try {
        let {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            })

        if (!device) {
            return res.status(404).json({message: 'Device not found'})
        }
        await DeviceInfo.destroy({where: {deviceId: id}})
        await Device.destroy({where: {id}})
        return res.json(device)
    } catch (error) {
        console.error('Error deleting device:', error)
        return res.status(500).json({message: 'An error occurred while deleting the device'})
    }
}


async getAll(req, res) {
    let {brandId, typeId, limit, page} = req.query
    page = page || 1
    limit = limit || 20
    let offset = (page - 1) * limit

    let devices

    if (!brandId && !typeId) {
        devices = await Device.findAndCountAll({limit, offset})
    }
    if (brandId && !typeId) {
        devices = await Device.findAndCountAll({
                where: {
                    brandId,
                },
                limit,
                offset
            }
        )
    }
    if (!brandId && typeId) {
        devices = await Device.findAndCountAll(
            {
                where: {
                    typeId,
                },
                limit,
                offset
            }
        )
    }
    if (brandId && typeId) {
        devices = await Device.findAndCountAll(
            {
                where: {
                    brandId,
                    typeId
                },
                limit,
                offset
            })
    }

    const pageCount = Math.ceil(devices.count / limit)

    return res.json({
        rows: devices.rows,
        count: devices.count,
        pagination: {
            currentPage: page,
            pageCount: pageCount,
            limit: limit
        }
    })
}

async getOne(req, res) {
    try {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        )

        return res.json(device)
    } catch (e) {
        return res.status(500).json({message: "Error retrieving device"})
    }
}

    async rateDevice(req, res) {
        console.log("Получен запрос на рейтинг", req.body)
        try {
            const { deviceId, rating } = req.body
            const userId = req.body.userId

            const existingRating = await Rating.findOne({
                where: { userId, deviceId }
            })

            if (existingRating) {
                return res.status(400).json({ message: "Вы уже оценили этот товар" })
            }

            await Rating.create({ userId, deviceId, name: rating })

            const ratings = await Rating.findAll({ where: { deviceId } })
            const avgRating = ratings.reduce((sum, r) => sum + r.name, 0) / ratings.length

            await Device.update({ rating: avgRating }, { where: { id: deviceId } })

            return res.json({ message: "Оценка добавлена", avgRating })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "Ошибка на сервере" })
        }
    }


}

module.exports = new DeviceController()