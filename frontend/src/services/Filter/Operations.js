import { useEffect, useState } from "react";
import config from "../../config/config";

export function useOperations(dateFilter, startDate, endDate, trigger = 0) {
    const [operations, setOperations] = useState([]);

    useEffect(() => {
        fetchOperations();
    }, [dateFilter, startDate, endDate, trigger]);

    const fetchOperations = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            let url = `${config.host}/api/operations`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch operations");
            }

            const data = await response.json();
            setOperations(data);
        } catch (error) {
            console.error("Error fetching operations:", error);
        }
    };

    // filtering operations based on selected date range
    const filteredOperations = operations.filter((op) => {
        const operationDate = new Date(op.date);
        const today = new Date();

        if (dateFilter === "today") {
            return op.date === new Date().toISOString().split("T")[0];
        }
        if (dateFilter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            return operationDate >= weekAgo && operationDate <= today;
        }
        if (dateFilter === "month") {
            return (
                operationDate.getFullYear() === today.getFullYear() &&
                operationDate.getMonth() === today.getMonth()
            );
        }
        if (dateFilter === "year") {
            return operationDate.getFullYear() === today.getFullYear();
        }
        if (dateFilter === "interval" && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            return operationDate >= start && operationDate <= end;
        }

        return true; // default: show all
    });

    return { fetchOperations, filteredOperations };
}
