# 📘 MyMoneyTrack – Budgeting App
This is a full-stack budgeting application built with Node.js (Express) for the backend and React.js for the frontend. 
It helps students manage income and expenses, view charts, and track finances across currencies.
## 📦 Project Setup
After cloning the project, install dependencies separately for both frontend and backend.
## 🔧 Backend Setup
1. Navigate to the backend folder:

cd backend
2. Install dependencies:

npm install
3. Start the backend server:

npm start

• Runs on: http://localhost:3000
• Stores data in JSON files (no database required)
• Requires: Node.js v18+ and npm
## 🧾 Backend Features
• JWT-based authentication (/api/register, /api/login)
• Income/Expense operations CRUD (/api/operations)
• Balance management (/api/balance)
• Category system (/api/categories)
• Manual balance override or automatic recalculation
## 🎨 Frontend Setup
1. Navigate to the frontend folder:

cd frontend
2. Install dependencies:

npm install
3. Start the React development server:

npm start
• Runs on: http://localhost:3001
• Talks to backend at http://localhost:3000
• Requires: Node.js v18+ and npm
## 🧾 Frontend Features
• Login / Register
• Dashboard with charts (Chart.js)
• Date filtering (today, week, month, year, interval)
• Create/Edit/Delete operations
• Real-time balance updates (manual or automatic)
• Multi-currency support (ExchangeRate-API)
• Responsive UI (Bootstrap)
## 📂 Project Structure
project-root/
├── backend/         # Express API with JSON file storage
├── frontend/        # React app with routing and charts
└── README.md        # This guide
## ✅ Final Notes
• Be sure to run both frontend and backend servers.
• No database is needed — everything is file-based.
• For real-time exchange rates, ensure a valid API key in Balance.jsx.
Happy budgeting! 💰
