const express = require("express");
const db = require("../config/database");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

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
        res.json(newUser);
    } catch (error) {
        res.status(400).json("Error creating user");
        // res.status(400).json(error.message);
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
    index
}
