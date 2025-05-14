import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../config/config";
import Popup from "../components/Popup";
import { getPopupMessage } from "../services/Popup";

function ExpenseCategories() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    useEffect(() => {
        fetchExpenseCategories();
    }, []);

    // fetching expense categories
    const fetchExpenseCategories = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(`${config.host}/api/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch expense categories");
            }

            const data = await response.json();
            setCategories(data.expense);
        } catch (error) {
            console.error("Error fetching expense categories:", error);
            setError("Failed to load expense categories.");
        }
    };

    // category delete popup
    const handleDelete = (categoryId) => {
        setCategoryToDelete(categoryId);
        setShowPopup(true);
    };

    // confirming delete & refresh list
    const confirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(`${config.host}/api/categories/${categoryToDelete}?type=expense`, {
                method: "DELETE",
                headers: {
                    "x-auth-token": token,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error deleting category:", data);
                setError(data.error || "Failed to delete category.");
                return;
            }


            setCategoryToDelete(null);
            setShowPopup(false);
            fetchExpenseCategories(); // Refresh
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete category.");
        }
    };

    return (
        <div className="container my-5">
            <h1 className="main-page-title">Expense</h1>

            {/* showing Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="main-page-content row row-cols-lg-4">
                {/* rendering expense categories */}
                {categories.map((category) => (
                    <div key={category.expense_id} className="main-page-content-div d-flex flex-column rounded-3 border p-3">
                        <h3>{category.title}</h3>
                        <div>
                            <Link to={`/expenseEdit/${category.expense_id}`} className="btn btn-primary me-1">
                                Edit
                            </Link>
                            <button className="btn btn-danger delete-btn" onClick={() => handleDelete(category.expense_id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {/* adding New Category button */}
                <Link to="/expenseCreation" className="main-page-content-div d-flex flex-column justify-content-center align-items-center rounded-3 border text-decoration-none p-3">
                    <p className="main-page-content-create">+</p>
                </Link>
            </div>

            {/* Delete confirmation popup */}
            {showPopup && (
                <Popup
                    message={getPopupMessage("expense")}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowPopup(false)}
                />
            )}
        </div>
    );
}

export default ExpenseCategories;
