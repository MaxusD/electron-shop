const db = require('../db')
class UserController {
    async createUser(req, res) {
        try {
            const userData = req.body
            const keys = Object.keys(userData)
            const values = Object.values(userData)

            const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')

            const query = `INSERT INTO users (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`
            const newUser = await db.query(query, values)

            res.json(newUser.rows[0])


        } catch (error) {
            console.error("Error creating user:", error)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }

    async getUsers(req, res) {
        const users = await db.query(`SELECT * FROM users`)
        res.json(users.rows)
    }

    async getUserCart(req, res) {
        //const id = req.params.id
        const users = await db.query(`
        SELECT
    users.id AS user_id,
    users.first_name AS user_name,
    users.last_name AS user_lastname,
    orders.id AS order_id,
    products.name AS product_name,
    cart_items.quantity AS product_quantity,
    products.price AS price_per_item,
    (cart_items.quantity * products.price) AS product_total_price,
    SUM(cart_items.quantity * products.price) OVER (PARTITION BY orders.id) AS order_total_price
        FROM users
        JOIN orders ON users.id = orders.user_id
        JOIN cart_items ON orders.user_id = cart_items.cart_id
        JOIN products ON cart_items.product_id = products.id
        ORDER BY users.id, orders.id, products.name;
        `)
        res.json(users.rows)
    }

    /*async getUserCartById(req, res) {
        const {id, name, surname} = req.body
        const user = await db.query('UPDATE person SET name = $1, surname = $2 WHERE id = $3 RETURNING *', [name, surname, id])
        res.json(user.rows[0])
    }*/

    async getUserCartById(req, res) {
        try {
            const {id} = req.params

            if (!id) {
                return res.status(400).json({error: "User ID is required"});
            }

            const user = await db.query(`
        SELECT
    users.id AS user_id,
    users.first_name AS user_name,
    users.last_name AS user_lastname,
    orders.id AS order_id,
    products.name AS product_name,
    cart_items.quantity AS product_quantity,
    products.price AS price_per_item,
    (cart_items.quantity * products.price) AS product_total_price,
    SUM(cart_items.quantity * products.price) OVER (PARTITION BY orders.id) AS order_total_price
        FROM users
        JOIN orders ON users.id = orders.user_id
        JOIN cart_items ON orders.user_id = cart_items.cart_id
        JOIN products ON cart_items.product_id = products.id
        WHERE users.id = $1`, [id])

            if (user.rows.length === 0) {
                return res.status(404).json({error: "No data found for the specified user"});
            }

            res.json(user.rows)
        } catch (error) {
            console.error("Database error:", error)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }

    async deleteUser(req, res) {
        const id = req.params.id
        const users = await db.query('DELETE FROM users WHERE id = $1', [id])
        res.json(users.rows[0])
    }

}

module.exports = new UserController()