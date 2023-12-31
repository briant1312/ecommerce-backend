const db = require("../config/database");

async function create(req, res) {
    try {
        const { name, description, category, price, qty, image_url } = req.body;

        let fields = "name, description, category";
        let values = [name, description, category, price, qty, image_url];
        let valueStr = "$1, $2, $3";

        for(let i = 3; i < values.length; i++) {
            if(values[i]) {
                valueStr += `, $${i + 1}`
            }
        }
        
        if(price) fields += ", price";
        if(qty) fields += ", qty";
        if(image_url) fields += ", image_url";

        const newItem = await db.one(
            `INSERT INTO items (${fields}) VALUES (${valueStr}) RETURNING *`,
            values
        );
        res.json(newItem);
    } catch (error) {
        res.status(400).json("error creating item");
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

async function indexCategory(req, res) {
    const category = req.params.category;
    try {
        const items = await db.any(
            'SELECT * FROM items WHERE category=$1',
            [category]
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
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json("error deleting item");
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
    }
}

module.exports = {
    create,
    index,
    show,
    deleteOne,
    update,
    indexCategory,
}
