import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css';
import './styles/form.css';
import './styles/incomesAndExpenses.css';
import './styles/pies.css';
import { BalanceProvider } from "./services/BalanceContext";

// layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IncomesAndExpenses from "./pages/IncomesAndExpenses";
import OperationCreation from "./pages/IncomesAndExpensesCreation";
import IncomesAndExpensesEdit from "./pages/IncomesAndExpensesEdit";
import Income from './pages/Income';
import IncomeCategoryCreate from "./pages/IncomeCreation";
import IncomeCategoryEdit from "./pages/IncomeEdit";
import Expense from './pages/Expense';
import ExpenseCategoryCreate from "./pages/ExpenseCreation";
import ExpenseCategoryEdit from "./pages/ExpenseEdit";
import NotFound from './pages/NotFound';



// a small Route Guard that checks for 'accessToken' in localStorage.
const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('accessToken');
    const isAuthenticated = !!token;

    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
    return (
        <BalanceProvider>
        <Routes>
            {/* AUTH LAYOUT (no sidebar) */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
            </Route>

            {/* MAIN LAYOUT (with sidebar, for logged-in users) */}

            <Route element={<MainLayout />}>
                <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route
                    path="/incomesAndExpenses"
                    element={<ProtectedRoute element={<IncomesAndExpenses />} />}
                />
                <Route path="/incomeAndExpensesCreation"
                       element={<ProtectedRoute element={<OperationCreation />} />} />
                <Route
                    path="/incomeAndExpensesEdit/:id"
                    element={<ProtectedRoute element={<IncomesAndExpensesEdit />} />}
                />
                <Route path="/income" element={<ProtectedRoute element={<Income />} />} />
                <Route path="/incomeEdit/:id" element={<ProtectedRoute element={<IncomeCategoryEdit />} />} />
                <Route
                    path="/incomeCreation"
                    element={<ProtectedRoute element={<IncomeCategoryCreate />} />}
                />
                <Route path="/expense" element={<ProtectedRoute element={<Expense />} />} />
                <Route path="/expenseEdit/:id" element={<ProtectedRoute element={<ExpenseCategoryEdit />} />} />
                <Route
                    path="/expenseCreation"
                    element={<ProtectedRoute element={<ExpenseCategoryCreate />} />}
                />
            </Route>

            {/* 404 / Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
</BalanceProvider>
    );
}

export default App;
