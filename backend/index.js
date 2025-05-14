require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/auth");
const operationsRoutes = require("./routes/operations");
const balanceRoutes = require("./routes/balance");
const categoriesRoutes = require("./routes/categories");

const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, "swagger.json"), "utf-8"));

const app = express();
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/operations", operationsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/balance", balanceRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
