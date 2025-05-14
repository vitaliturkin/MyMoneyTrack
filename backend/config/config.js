module.exports = {
    secret: process.env.JWT_SECRET || "supersecret",
    port: process.env.PORT || 3000,
};
