const db = require("../config/database");

async function create(req, res) {
    try {
        const { name, description, qty, price, image_url } = req.body;

        let fields = "name, description";
        let values = [name, description, price, qty, image_url];
        let valueStr = "$1, $2";

        for(let i = 2; i < values.length; i++) {
            if(values[i]) {
                valueStr += `, $${i + 1}`
            }
        }
        
        if(qty) fields += ", qty";
        if(image_url) fields += ", image_url";

        const newItem = await db.one(
            `INSERT INTO items (${fields}) VALUES (${valueStr}) RETURNING *`,
            values
        );
        res.json(newItem);
    } catch (error) {
        res.status(400).json("error creating item");
        // res.status(400).json(error.message);
    }
}

async function index(req, res) {
    try {
        const items = await db.any(
            'SELECT * FROM items'
        )
        res.json(items);
    } catch (error) {
        res.status(400).json("error fetching items");
    }
}

async function show(req, res) {
    const id = req.params.id;
    try {
        const item = await db.oneOrNone(
            'SELECT * FROM items WHERE id=$1', [id]
        );
        res.json(item);
    } catch (error) {
        res.status(400).json("error fetching item");
    }
}

async function deleteOne(req, res) {
    const id = req.params.id;
    try {
        await db.none(
            'DELETE FROM items WHERE id=$1', [id]
        );
        res.status(204).json(`Item id ${id} removed from database`);
    } catch (error) {
        res.status(400).json("error fetching item");
    }
}

async function update(req, res) {
    const id = req.params.id;
    const { name, description, qty, price, image_url } = req.body;

    if(!name || !description || !qty || !price || !image_url) {
        res.status(400).json("all fields are required to update");
        return;
    }

    try {
        const updatedItem = await db.oneOrNone(
            `UPDATE items SET 
            name = $1,
            description = $2,
            qty = $3,
            price = $4,
            image_url = $5
            WHERE id=$6 RETURNING *`, 
            [name, description, qty, price, image_url, id]
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json("error updating item");
        // res.status(400).json(error.message);
    }
}

module.exports = {
    create,
    index,
    show,
    deleteOne,
    update
}
