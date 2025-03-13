const {query} = require("express")
const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {User, Cart} = require("../models/models")

const generateJwt = (id, email, role, firstName, lastName) => {
    return jwt.sign(
        {id, email, role, firstName, lastName},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, firstName, lastName, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Incorrect email or password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('User already exists'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword, firstName, lastName})
        const cart = await Cart.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role, user.firstName, user.lastName)
        return res.json({token})

    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('The user is not found'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal("The password is not correct"))
        }
        const token = generateJwt(user.id, user.email, user.role, user.firstName, user.lastName)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.firstName, req.user.lastName)
        return res.json({token})
    }

    async changePassword (req, res, next) {
        const { email, currentPassword, newPassword } = req.body

        try {
            const user = await User.findOne({ where: {email} })

            if (!user) {
                return next(ApiError.badRequest('User not found'))
            }

            const isPasswordValid = bcrypt.compareSync(currentPassword, user.password)

            if (!isPasswordValid) {
                return next(ApiError.badRequest('Current password is incorrect'))
            }

            const hashPassword = await bcrypt.hash(newPassword, 5)
            await User.update({ password: hashPassword }, { where: { email } })

            return res.json({ message: 'Password changed successfully' })
        } catch (error) {
            return next(ApiError.internal('Failed to change password'))
        }
    }

    async updateProfile (req, res, next) {
        const { userId, firstName, lastName } = req.body
        try {
            const [updated] = await User.update(
                { firstName, lastName },
                { where: { id: userId } }
            )

            if (updated === 0) {
                return next(ApiError.badRequest('User not found'))
            }

            const user = await User.findOne({ where: { id: userId } })
            return res.json(user)
        } catch (error) {
            return next(ApiError.internal('Failed to update profile'))
        }
    }


}

module.exports = new UserController()