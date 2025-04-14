const sequelize = require('../db')

const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    firstName: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'customer'}
})

const Cart = sequelize.define('carts', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const CartDevice = sequelize.define('cart_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.DOUBLE, allowNull: false},
    rating: {type: DataTypes.DOUBLE, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: 0}
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Rating = sequelize.define('ratings', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.FLOAT, allowNull: false}
})

const DeviceInfo = sequelize.define('device_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false}
})

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    deviceId: {type: DataTypes.INTEGER, allowNull: false},
    text: {type: DataTypes.STRING, allowNull: false}
})

User.hasOne(Cart)
Cart.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User, {foreignKey: 'userId'})

Cart.hasMany(CartDevice)
CartDevice.belongsTo(Cart)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(CartDevice)
CartDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, {as: 'info', foreignKey: 'deviceId'})
DeviceInfo.belongsTo(Device, {foreignKey: 'deviceId'})

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

User.hasMany(Comment, { foreignKey: 'userId' })
Comment.belongsTo(User, { foreignKey: 'userId' })
Comment.belongsTo(Rating, {
    foreignKey: 'userId',
    targetKey: 'userId',
    constraints: false
} )

Device.hasMany(Comment)
Comment.belongsTo(Device)

module.exports = {
    User,
    Cart,
    CartDevice,
    Brand,
    Rating,
    Device,
    DeviceInfo,
    Type,
    TypeBrand,
    Comment
}
