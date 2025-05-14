const jwtLib = require("jsonwebtoken");
const configData = require("../config/config");

// creating a single long-lived token for the user.
async function createToken(userObj) {
    try {
        // payload for the token
        const userPayload = {
            user_id: userObj.user_id,
            email: userObj.email
        };

        // long-lived token (e.g. 30 days)
        const token = jwtLib.sign(
            userPayload,
            configData.secret,
            { expiresIn: "30d" }
        );

        return { token };
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    createToken,
};
