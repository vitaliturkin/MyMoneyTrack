const fs = require("fs");
const path = require("path");

// function to read data from a JSON file
const readData = (fileName) => {
    const filePath = path.join(__dirname, "../data", fileName);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: ${fileName} not found. Returning empty object.`);
        return {};
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// function to write data to a JSON file
const writeData = (fileName, data) => {
    const filePath = path.join(__dirname, "../data", fileName);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error(`Error writing to ${fileName}:`, error);
    }
};

module.exports = { readData, writeData };
