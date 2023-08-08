const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 6;

function createJWT(user) {
    return jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn: '24h' }
    )
}

async function create(req, res) {
    try {
        let { username, password, is_admin } = req.body;
        const takenUser = await db.oneOrNone(
            'SELECT * FROM users WHERE username=$1', [username]
        );
        if(takenUser) {
            res.status(400).json("Username is already taken");
            return;
        }
        password = await bcrypt.hash(password, SALT_ROUNDS);

        if (!is_admin) is_admin = false;
        const newUser = await db.one(
            'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING *',
            [username, password, is_admin]
        );
        const token = createJWT(newUser);
        res.json(token);
    } catch (error) {
        res.status(400).json("Error creating user");
        // res.status(400).json(error.message);
    }
}

async function logIn(req, res) {
    const { username, password } = req.body;
    try {
        const user = await db.oneOrNone(
            'SELECT * FROM users WHERE username=$1', [username]
        );
        if (!user) {
            res.status(422).json("Invalid username or password");
            return;
        }

        if(bcrypt.compareSync(password, user.password)) {
            res.json(createJWT(user));
        } else {
            res.status(422).json("Invalid username or password");
        }
    } catch (error) {
        res.status(422).json("unable to process request");
    }
}

async function index(req, res) {
    try {
        const users = await db.any('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(400).json("Error fetching users");
    }
}

module.exports = {
    create,
    index,
    logIn,
}
