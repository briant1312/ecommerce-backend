const db = require("../config/database");

async function create(req, res) {
    const userId = req.user.id;
    try {
        const order = await db.oneOrNone(
            'INSERT INTO orders (user_id) VALUES ($1) RETURNING *',
            [userId]
        )
        res.json(order);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

async function completeOrder(req, res) {
    const id = req.params.id;
    const userId = req.user.id;
    try {
        const order = await db.oneOrNone(
            'UPDATE orders SET is_completed = true WHERE (id=$1 AND user_id=$2) RETURNING *',
            [id, userId]
        )
        res.json(order);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

async function addItemToOrder(req, res) {
    const itemId = req.params.itemId;
    const userId = req.user.id;
    db.task(t => {
        return t.oneOrNone('SELECT id FROM orders WHERE (user_id=$1 AND is_completed=false)', [userId])
            .then(({ id: orderId }) => {
                return t.none('INSERT into order_items (order_id, item_id) VALUES ($1, $2)', [orderId, itemId])
            })
    }) 
        .then(() => {
            res.sendStatus(204);
        })
        .catch(error => {
            // res.status(400).json("error creating order");
            res.status(400).json(error.message);
        })
}

async function removeItemFromOrder(req, res) {
    const itemId = req.params.itemId;
    const userId = req.user.id;
    db.task(t => {
        return t.oneOrNone('SELECT id FROM orders WHERE (user_id=$1 AND is_completed=false)', [userId])
            .then(({ id: orderId }) => {
                return t.none('DELETE FROM order_items WHERE (order_id=$1 AND item_id=$2)', [orderId, itemId])
            })
    })
        .then(() => {
            res.sendStatus(204);
        })
        .catch(error => {
            // res.status(400).json("error creating order");
            res.status(400).json(error.message);
        })
}

module.exports = {
    create,
    completeOrder,
    addItemToOrder,
    removeItemFromOrder,
}
