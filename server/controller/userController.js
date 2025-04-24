const {query} = require("express")
const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {User, Cart} = require("../models/models")
const {createTransport} = require("nodemailer")


const generateJwt = (id, email, role, firstName, lastName) => {
    return jwt.sign(
        {id, email, role, firstName, lastName},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '30d' })
    return { accessToken, refreshToken }
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
            return next(ApiError.internal('User not found'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal("Incorrect password"))
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        }
        //const token = generateJwt(user.id, user.email, user.role, user.firstName, user.lastName)
        const { accessToken, refreshToken } = generateTokens(payload)
        //return res.json({token})
        res
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // true, если https
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            .json({ token: accessToken })
    }

    async check(req, res, next) {
        const payload = {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            firstName: req.user.firstName,
            lastName: req.user.lastName
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15m' })
        //const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.firstName, req.user.lastName)
        return res.json({token})
    }

    async refresh(req, res, next) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(401).json({ message: 'Not authorized' })

        try {
            const userData = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)
            const payload = {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                firstName: userData.firstName,
                lastName: userData.lastName
            }

            const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload)

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            res.json({ token: accessToken })
        } catch (error) {
            return res.status(403).json({ message: 'Refresh token expired or invalid' })
        }
    }

    async logout(req, res) {
        res.clearCookie('refreshToken')
        return res.sendStatus(200)
    }


    async changePassword(req, res, next) {
        const {email, currentPassword, newPassword} = req.body

        try {
            const user = await User.findOne({where: {email}})

            if (!user) {
                return next(ApiError.badRequest('User not found'))
            }

            const isPasswordValid = bcrypt.compareSync(currentPassword, user.password)

            if (!isPasswordValid) {
                return next(ApiError.badRequest('Current password is incorrect'))
            }

            const hashPassword = await bcrypt.hash(newPassword, 5)
            await User.update({password: hashPassword}, {where: {email}})

            return res.json({message: 'Password changed successfully'})
        } catch (error) {
            return next(ApiError.internal('Failed to change password'))
        }
    }

    async updateProfile(req, res, next) {
        const {userId, firstName, lastName} = req.body
        try {
            const [updated] = await User.update(
                {firstName, lastName},
                {where: {id: userId}}
            )

            if (updated === 0) {
                return next(ApiError.badRequest('User not found'))
            }

            const user = await User.findOne({where: {id: userId}})
            return res.json(user)
        } catch (error) {
            return next(ApiError.internal('Failed to update profile'))
        }
    }

    async sendOrder(req, res) {
        const {email, order} = req.body

        const transporter = createTransport({
            host: 'smtp.ukr.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.UKRNET_EMAIL,
                pass: process.env.UKRNET_PASSWORD
            }
        })

        const orderHtml = order.map(item => `
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dee2e6; border-radius:5px; margin-bottom:20px; font-family:Arial, sans-serif; background-color:#f8f9fa;">
                <tr>
                    <td style="padding:10px; width: 200px;">
                        <img src="${item.img}" alt="${item.name}" style="display:block; height:150px; border-radius:5px;" />
                    </td>
                    <td style="padding:10px; vertical-align:top;">
                        <h4 style="margin:0 0 8px; color:#343a40;">${item.name}</h4>
                        <p class='order_field' style="margin: 4px 0;"><strong>Количество:</strong> ${item.quantity}</p>
                        <p class='order_field' style="margin: 4px 0;"><strong>Цена за единицу:</strong> ${item.price} UAH</p>
                        <p class='order_field' style="margin: 4px 0;"><strong>Сумма:</strong> ${item.price * item.quantity} UAH</p>
                    </td>
                </tr>
            </table>
        `).join('')

        const totalPrice = order.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const htmlContent = `
    <div style="max-width:600px; margin:0 auto; background:#ffffff; padding:20px; border-radius:10px; font-family:Arial, sans-serif;">
        <h2 style="text-align:center; color:#198754;">Thank you for your order!</h2>
        <p style="text-align:center;">Order's details:</p>
        ${orderHtml}
        <h3 style="text-align:right; color:#0d6efd;">Total price: ${totalPrice} UAH</h3>
        <p style="margin-top:40px; text-align:center; color:#6c757d; font-size:14px;">
            This letter is generated automatically. Please do not reply to it.
        </p>
    </div>
        `

        await transporter.sendMail({
            from: `"Electron Shop" <${process.env.UKRNET_EMAIL}>`,
            to: email,
            subject: 'Your order',
            html: htmlContent
        })

        res.json({success: true})
    }


}

module.exports = new UserController()