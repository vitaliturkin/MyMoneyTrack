const express = require("express");
const validateUser = require("../utils/middleware");
const { readData, writeData } = require("../utils/data");

const router = express.Router();

// paths to JSON files
const incomeFilePath = "income.data.json";
const expenseFilePath = "expense.data.json";
const operationsFilePath = "operations.data.json";

// GET /categories
router.get("/", validateUser, (req, res) => {
    const userId = req.user.user_id; // using user_id from decoded token

    const incomeData = readData(incomeFilePath);
    const expenseData = readData(expenseFilePath);

    // ensuring arrays exist
    if (!incomeData.income) incomeData.income = [];
    if (!expenseData.expense) expenseData.expense = [];

    // filtering categories for this user
    const userIncomeCategories = incomeData.income.filter(cat => cat.user_id === userId);
    const userExpenseCategories = expenseData.expense.filter(cat => cat.user_id === userId);

    res.json({
        income: userIncomeCategories,
        expense: userExpenseCategories
    });
});

// GET /categories/:id?type=income|expense - Fetch a specific category
router.get("/:id", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { type } = req.query;

    if (!type || (type !== "income" && type !== "expense")) {
        return res.status(400).json({
            error: "Valid type=(income|expense) is required in query params"
        });
    }

    const filePath = type === "income" ? incomeFilePath : expenseFilePath;
    let data = readData(filePath);

    if (!data[type]) data[type] = [];

    // Finding the category
    const category = data[type].find(cat =>
        cat[type + "_id"] === parseInt(id) && cat.user_id === userId
    );

    if (!category) {
        return res.status(404).json({ error: "Category not found or does not belong to you" });
    }

    res.json(category);
});

//POST /categories
router.post("/", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { title, type } = req.body;

    if (!title || !type || (type !== "income" && type !== "expense")) {
        return res.status(400).json({
            error: "title and valid type=(income or expense) are required."
        });
    }

    const filePath = type === "income" ? incomeFilePath : expenseFilePath;
    let data = readData(filePath);

    if (!data[type]) data[type] = [];

    // generating unique category ID (e.g., income_id or expense_id)
    const newId = data[type].length > 0
        ? Math.max(...data[type].map(c => c[type + "_id"])) + 1
        : 1;

    // assigning user_id to new category
    const newCategory = {
        [type + "_id"]: newId,
        title,
        user_id: userId
    };

    data[type].push(newCategory);
    writeData(filePath, data);

    return res.status(201).json({
        message: "Category added successfully",
        category: newCategory
    });
});

//PUT /categories/:id
router.put("/:id", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { title, type } = req.body;

    if (!title || !type || (type !== "income" && type !== "expense")) {
        return res.status(400).json({
            error: "title and valid type=(income or expense) are required."
        });
    }

    const filePath = type === "income" ? incomeFilePath : expenseFilePath;
    let data = readData(filePath);

    if (!data[type]) data[type] = [];

    // finding the category for this user
    let category = data[type].find(cat =>
        cat[type + "_id"] === parseInt(id) && cat.user_id === userId
    );
    if (!category) {
        return res.status(404).json({
            error: "Category not found or does not belong to you"
        });
    }

    // updating the title
    category.title = title;
    writeData(filePath, data);

    res.json({
        message: "Category updated successfully",
        category
    });
});

//DELETE /categories/:id?type=income|expense
router.delete("/:id", validateUser, (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { type } = req.query;

    if (!type || (type !== "income" && type !== "expense")) {
        return res.status(400).json({
            error: "Valid type=(income|expense) is required in query params"
        });
    }

    const filePath = type === "income" ? incomeFilePath : expenseFilePath;
    let data = readData(filePath);
    if (!data[type]) data[type] = [];

    // ensuring category belongs to logged-in user
    let category = data[type].find(cat =>
        cat[type + "_id"] === parseInt(id) && cat.user_id === userId
    );
    if (!category) {
        return res.status(404).json({
            error: "Category not found or does not belong to you"
        });
    }

    // checking if the category is used in the user's operations
    let operationsData = readData(operationsFilePath);
    if (!operationsData.operations) operationsData.operations = [];

    let isUsed = operationsData.operations.some(op =>
        op[`${type}_id`] === parseInt(id) &&
        op.user_id === userId
    );

    if (isUsed) {
        return res.status(400).json({
            error: "Cannot delete category, it is used in operations"
        });
    }

    // removing the category
    data[type] = data[type].filter(cat => cat[type + "_id"] !== parseInt(id));
    writeData(filePath, data);

    res.json({ message: "Category deleted successfully" });
});

module.exports = router;
