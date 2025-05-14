const jwt = require("jsonwebtoken");
const config = require("../config/config");

// middleware to validate the user's token via the "x-auth-token" header.
function validateUser(req, res, next) {
    // extracting token from x-auth-token header
    const token = req.headers["x-auth-token"];
    if (!token) {
        return res.status(401).json({ error: true, message: "No token provided" });
    }

    // verifying token
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: true, message: err.message });
        }
        req.user = decoded;
        next();
    });
}

module.exports = validateUser;
