require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const { readData, writeData } = require("../utils/data");
const { createToken } = require("../utils/tokens");

const router = express.Router();
const USER_DATABASE = "user.data.json";

// register a new user.
router.post("/register", async (req, res) => {
    const { name, lastName, email, password } = req.body;
    let userDb = readData(USER_DATABASE);

    if (!userDb.users) {
        userDb.users = [];
    }

    // checking if user already exists
    if (userDb.users.some(u => u.email === email)) {
        return res.status(400).json({ message: "User already exists" });
    }

    // generating user ID
    const nextUserId = userDb.users.length > 0
        ? Math.max(...userDb.users.map(u => u.user_id)) + 1
        : 1;

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new user object
    const newUser = {
        user_id: nextUserId,
        name,
        lastName,
        email,
        password: hashedPassword
    };

    // saving user to DB
    userDb.users.push(newUser);
    writeData(USER_DATABASE, userDb);

    // generating JWT Token
    const userObj = { user_id: newUser.user_id, email: newUser.email };
    const { token } = await createToken(userObj);

    return res.status(201).json({
        token,
        user: {
            id: newUser.user_id,
            name: newUser.name,
            lastName: newUser.lastName,
            email: newUser.email
        }
    });
});

// logs in an existing user, returning a token pair.
router.post("/login", async (req, res) => {
    const { email, password, rememberMe } = req.body;
    let userDb = readData(USER_DATABASE);

    if (!Array.isArray(userDb.users)) {
        return res.status(500).json({ message: "User DB corrupted." });
    }

    const foundUser = userDb.users.find(u => u.email === email);
    if (!foundUser) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPass = await bcrypt.compare(password, foundUser.password);
    if (!isValidPass) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // generating JWT Token
    const userObj = { user_id: foundUser.user_id, email: foundUser.email };
    const { token }  = await createToken(userObj, rememberMe);

    return res.json({
        token,
        user: {
            id: foundUser.user_id,
            name: foundUser.name,
            lastName: foundUser.lastName,
            email: foundUser.email,
        }
    });
});


// logs out a user
router.post("/logout", (req, res) => {
    return res.status(200).json({ message: "Logged out successfully (client must discard tokens)" });
});

module.exports = router;
