import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config/config";

function IncomeCategoryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const fetchCategory = useCallback(async () => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(`${config.host}/api/categories/${id}?type=income`, {
                method: "GET",
                headers: {
                    "x-auth-token": token
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch category");
            }

            const data = await response.json();
            setTitle(data.title);
        } catch (error) {
            console.error("Error fetching category:", error);
            setError("Failed to load category.");
        }
    }, [id]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    // Handle category update
    const handleUpdate = async () => {
        if (!title.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(`${config.host}/api/categories/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
                body: JSON.stringify({ title, type: "income" })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to update category.");
                return;
            }

            navigate("/income"); // redirecting to income categories page
        } catch (error) {
            console.error("Error updating category:", error);
            setError("Failed to update category.");
        }
    };

    return (
        <div className="container my-5">
            <h1 className="main-page-title">Edit Income Category</h1>

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
                    <button type="button" className="btn btn-success me-1" onClick={handleUpdate}>
                        Save
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => navigate("/income")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IncomeCategoryEdit;
