const jwt = require('jsonwebtoken')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTION') {
            next()
        }


        try {
            const token = req.headers.authorization.split(' ')[1]

            if (!token) {
                return res.status(401).json({message: "User is not authorized!!!"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            if (decoded.role !== role) {
                return res.status(403).json({message: "Role does not match"})
            }
            req.user = decoded
            next()
        } catch (err) {
            res.status(401).json({message: "User is not authorized"})
        }
    }
}