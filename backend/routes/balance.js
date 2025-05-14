const express = require("express");
const validateUser = require("../utils/middleware");
const { readData, writeData } = require("../utils/data");

const router = express.Router();
const operationsFilePath = "operations.data.json";
const balanceFilePath = "balance.data.json";

// GET /balance
router.get("/", validateUser, (req, res) => {
    const userId = req.user.user_id;
    let data = readData(balanceFilePath);

    if (!data.balances) data.balances = [];

    const userBalance = data.balances.find(b => b.user_id === userId);
    if (!userBalance) {
        return res.status(404).json({ error: "No balance found for this user" });
    }

    res.json(userBalance);
});

// PUT /balance
router.put("/", validateUser, (req, res) => {
    try {
        const userId = req.user.user_id;

        let operationsData = readData(operationsFilePath);
        let balanceData = readData(balanceFilePath);

        if (!operationsData.operations) operationsData.operations = [];
        if (!balanceData.balances) balanceData.balances = [];

        // find or create user balance record
        let userBalance = balanceData.balances.find(b => b.user_id === userId);
        if (!userBalance) {
            userBalance = { user_id: userId, balance: 0 };
            balanceData.balances.push(userBalance);
        }

        let newBalance;

        if (req.body.balance !== undefined) {
            // manual override
            newBalance = parseFloat(req.body.balance);
            if (isNaN(newBalance)) {
                return res.status(400).json({ error: "Balance must be a valid number." });
            }
        } else {
            // recalculating from operations
            const userOperations = operationsData.operations.filter(op => op.user_id === userId);

            newBalance = userOperations.reduce((total, op) => {
                const amount = parseFloat(op.amount);
                if (isNaN(amount)) return total;
                return op.type === "income" ? total + amount : total - amount;
            }, 0);
        }

        userBalance.balance = newBalance;

        writeData(balanceFilePath, balanceData);

        res.json({ message: "Balance updated successfully", balance: userBalance.balance });
    } catch (error) {
        console.error("Server Error in /balance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
