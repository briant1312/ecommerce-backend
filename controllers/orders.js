const db = require("../config/database");

async function getUserCart(req, res) {
    const userId = req.user.id;

    try {
        let order = await db.oneOrNone(
            'SELECT id FROM orders WHERE (user_id=$1 AND is_completed=false)',
            [userId]
        )
        if (!order) {
            order = await db.one(
                'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
                [userId]
            )
        }
        res.json(order);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

// TODO: verify qty in stock and update after completing the order
async function completeOrder(req, res) {
    const orderId = req.params.orderId;
    const userId = req.user.id;

    try {
        const order = await db.oneOrNone(
            'UPDATE orders SET is_completed = true WHERE (id=$1 AND user_id=$2) RETURNING *',
            [orderId, userId]
        )
        res.json(order);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

async function getItemCount(req, res) {
    const { orderId } = req.params;

    try {
        const data = await db.manyOrNone(
            'SELECT qty FROM order_items WHERE (order_id=$1)',
            [orderId]
        )
        let count = 0;
        data.forEach(num => count += num.qty);
        res.json(count);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

async function addItemToOrder(req, res) {
    const userId = req.user.id;
    const { itemId, orderId, qty } = req.body;
    if (!itemId || !orderId || !qty) {
        return res.status(400).json("itemId, orderId, and qty are required to be passed in");
    }

    try {
        const order = await db.one(
            'SELECT is_completed, user_id FROM orders WHERE (id=$1)',
            [orderId]
        )
        if (order.user_id !== userId) {
            res.status(401).json("unauthorized");
            return;
        }
        if (order.is_completed) {
            res.status(400).json("cannot add items to completed orders");
            return;
        } 

        const updatedField = await db.oneOrNone(
            `UPDATE order_items SET
            qty = qty + $3
            WHERE (order_id=$2 AND item_id=$1) RETURNING *`,
            [itemId, orderId, qty]
        )

        if (updatedField) {
            res.sendStatus(204);
            return;
        }

        await db.none(
            'INSERT INTO order_items (order_id, item_id, qty) VALUES ($1, $2, $3)',
            [orderId, itemId, qty]
        )
        res.sendStatus(204);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

async function removeItemFromOrder(req, res) {
    const userId = req.user.id;
    const { itemId, orderId, qty } = req.body;
    if (!itemId || !orderId || !qty) {
        return res.status(400).json("itemId, orderId, and qty are required to be passed in");
    }

    try {
        const order = await db.one(
            'SELECT is_completed, user_id FROM orders WHERE (id=$1)',
            [orderId]
        )
        if (order.user_id !== userId) {
            res.status(401).json("unauthorized");
            return;
        }
        if (order.is_completed) {
            res.status(400).json("cannot remove items from completed orders");
            return;
        } 

        const orderItem = await db.oneOrNone(
            'SELECT qty FROM order_items WHERE (order_id=$1 AND item_id=$2)',
            [orderId, itemId]
        )
        if (!orderItem) {
            res.sendStatus(204);
            return;
        }
        if (qty >= orderItem.qty) {
            await db.none(
                'DELETE FROM order_items WHERE (order_id=$1 AND item_id=$2)',
                [orderId, itemId]
            )
            res.sendStatus(204);
            return;
        }
        await db.none(
            `UPDATE order_items SET
            qty = qty - $3
            WHERE (order_id=$2 AND item_id=$1)`,
            [itemId, orderId, qty]
        )
        res.sendStatus(204);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

async function getItemsFromOrder(req, res) {
    const { orderId } = req.params;

    try {
        const items = await db.manyOrNone(
            `SELECT name, image_url, price, order_items.qty, id
            FROM items 
            JOIN order_items 
            ON item_id = items.id 
            WHERE (order_id=$1)`,
            [orderId]
        )
        res.json(items);
    } catch (error) {
        // res.status(400).json("error creating order");
        res.status(400).json(error.message);
    }
}

module.exports = {
    getUserCart,
    completeOrder,
    addItemToOrder,
    removeItemFromOrder,
    getItemCount,
    getItemsFromOrder,
}
