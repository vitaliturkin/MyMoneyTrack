import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config/config";

function ExpenseCategoryCreate() {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(`${config.host}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
                body: JSON.stringify({ title, type: "expense" })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create category.");
                return;
            }

            navigate("/expense"); // redirecting to expenses page
        } catch (error) {
            console.error("Error creating category:", error);
            setError("Failed to create category.");
        }
    };

    return (
        <div className="container my-5">
            <h1 className="main-page-title">Create Expense Category</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="editing-create-content">
                <input
                    type="text"
                    className="main-page-items-input"
                    placeholder="Category Name..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="content-button">
                    <button type="button" className="btn btn-success me-1" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => navigate("/expense")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExpenseCategoryCreate;
