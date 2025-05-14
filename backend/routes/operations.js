const express = require("express");
const validateUser = require("../utils/middleware");
const { readData, writeData } = require("../utils/data");

const router = express.Router();
const operationsFilePath = "operations.data.json";

// GET all operations
router.get("/", validateUser, (req, res) => {
    // if JWT includes user_id in payload
    const userId = req.user.user_id;
    let data = readData(operationsFilePath);

    if (!data.operations) data.operations = [];

    // returning only the operations belonging to this user
    const userOperations = data.operations.filter(op => op.user_id === userId);
    res.json(userOperations);
});

// GET - fetching a single operation by ID
router.get("/:id", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;

    let data = readData(operationsFilePath);
    if (!data.operations) data.operations = [];

    // Find the operation belonging to this user
    let operation = data.operations.find(op => op.operation_id === parseInt(id) && op.user_id === userId);

    if (!operation) {
        return res.status(404).json({ error: "Operation not found or does not belong to you" });
    }

    res.json(operation);
});

// POST a new operation (income or expense)
router.post("/", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { type, amount, date, comment, category_id } = req.body;

    // Validate required fields
    if (!type || !amount || !date || !category_id
        || (type !== "income" && type !== "expense")) {
        return res.status(400).json({
            error: "Missing or invalid operation details"
        });
    }

    let data = readData(operationsFilePath);
    if (!data.operations) data.operations = [];

    // generating a new operation ID
    const newOpId = data.operations.length > 0
        ? Math.max(...data.operations.map(op => op.operation_id)) + 1
        : 1;

    // building the new operation
    const newOperation = {
        operation_id: newOpId,
        user_id: userId,
        type,
        amount,
        date,
        comment,
        [`${type}_id`]: category_id // e.g. income_id or expense_id
    };

    data.operations.push(newOperation);
    writeData(operationsFilePath, data);

    res.status(201).json({
        message: "Operation added successfully",
        operation: newOperation
    });
});

// PUT - updating an existing operation
router.put("/:id", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { amount, date, comment, category_id } = req.body;

    let data = readData(operationsFilePath);
    if (!data.operations) data.operations = [];

    // finding the operation belonging to this user
    let operation = data.operations.find(
        op => op.operation_id === parseInt(id) && op.user_id === userId
    );
    if (!operation) {
        return res.status(404).json({
            error: "Operation not found or does not belong to you"
        });
    }

    // updating any allowed fields
    if (amount) operation.amount = amount;
    if (date) operation.date = date;
    if (comment) operation.comment = comment;
    if (category_id) {
        // Use the existing type to determine whether it's income_id or expense_id
        operation[`${operation.type}_id`] = category_id;
    }

    writeData(operationsFilePath, data);
    res.json({
        message: "Operation updated successfully",
        operation
    });
});

// DELETE - removing an operation
router.delete("/:id", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;

    let data = readData(operationsFilePath);
    if (!data.operations) data.operations = [];

    // locating the operation for this user
    let operationIndex = data.operations.findIndex(
        op => op.operation_id === parseInt(id) && op.user_id === userId
    );
    if (operationIndex === -1) {
        return res.status(404).json({
            error: "Operation not found or does not belong to you"
        });
    }

    data.operations.splice(operationIndex, 1);
    writeData(operationsFilePath, data);

    res.json({ message: "Operation deleted successfully" });
});

module.exports = router;
