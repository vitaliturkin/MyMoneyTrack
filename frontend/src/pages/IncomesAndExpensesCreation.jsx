import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBalanceContext } from "../services/BalanceContext";
import config from "../config/config";

function OperationCreation() {
    const { fetchBalance } = useBalanceContext();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");

    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [setBalance] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    // fetching Categories
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${config.host}/api/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }

            const data = await response.json();
            setCategories(type === "income" ? data.income : data.expense);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories.");
        }
    };

    // form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!categoryId || !amount || !date) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(`${config.host}/api/operations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
                body: JSON.stringify({
                    type,
                    amount: parseFloat(amount),
                    date,
                    comment,
                    category_id: parseInt(categoryId)
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create operation");
            }

            // recalculating balance in backend
            await fetch(`${config.host}/api/balance`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                }
            });

            // refreshing balance
            await fetchBalance();

            // navigating back
            navigate("/incomesAndExpenses");
        } catch (error) {
            console.error("Error creating operation:", error);
            setError("Failed to create operation.");
        }
    };

    return (
        <div className="container my-5">
            <h1 className="main-page-title">Create {type === "income" ? "Income" : "Expense"}</h1>

            <form className="main-page-items flex-column d-flex" onSubmit={handleSubmit}>
                {/* Type (Disabled) */}
                <label>
                    <input className="main-page-items-input" type="text" value={type} disabled />
                </label>

                {/* Category Selection */}
                <label>
                    <select
                        className="main-page-items-input"
                        required
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Select a category...</option>
                        {categories.map((cat) => (
                            <option key={cat[`${type}_id`]} value={cat[`${type}_id`]}>
                                {cat.title}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Amount */}
                <label>
                    <input
                        className="main-page-items-input"
                        type="number"
                        placeholder="Amount in £..."
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>

                {/* Date */}
                <label>
                    <input
                        className="main-page-items-input"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>

                {/* Comment */}
                <label>
                    <input
                        className="main-page-items-input"
                        type="text"
                        placeholder="Comment..."
                        value={comment}
                        required
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>

                {/* Buttons */}
                <div className="main-page-item-options">
                    <button type="submit" className="main-page-item-options-edit btn btn-success me-2">
                        Save
                    </button>
                    <button type="button" className="main-page-item-options-delete btn btn-danger" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>

                {/* Show Error Message */}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
        </div>
    );
}

export default OperationCreation;
