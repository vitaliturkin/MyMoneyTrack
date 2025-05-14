import React, { useState, useEffect } from "react";

function DateFilter({ onFilterChange }) {
    const [dateFilter, setDateFilter] = useState("today");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // loading saved filter from local storage on page load
    useEffect(() => {
        const savedFilter = localStorage.getItem("dateFilter");
        const savedStartDate = localStorage.getItem("startDate");
        const savedEndDate = localStorage.getItem("endDate");

        if (savedFilter) {
            setDateFilter(savedFilter);
            if (savedFilter === "interval" && savedStartDate && savedEndDate) {
                setStartDate(savedStartDate);
                setEndDate(savedEndDate);
                onFilterChange(savedFilter, savedStartDate, savedEndDate);
            } else {
                onFilterChange(savedFilter, "", "");
            }
        }
    }, [onFilterChange]);

    // saving filter to local storage
    const handleFilterChange = (filter) => {
        setDateFilter(filter);
        setErrorMessage("");
        localStorage.setItem("dateFilter", filter);

        if (filter !== "interval") {
            localStorage.removeItem("startDate");
            localStorage.removeItem("endDate");
            onFilterChange(filter, "", "");
        }
    };

    const handleDateChange = (type, value) => {
        if (type === "start") {
            setStartDate(value);
            setEndDate("");
        } else {
            setEndDate(value);
        }
        setErrorMessage("");
    };

    const validateAndApply = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) {
                setErrorMessage("End date cannot be before start date.");
                return;
            }

            // saving interval dates to local storage
            localStorage.setItem("startDate", startDate);
            localStorage.setItem("endDate", endDate);

            onFilterChange("interval", startDate, endDate);
        }
    };

    return (
        <div className="main-page-nav d-flex flex-row align-items-center mb-3">
            {/* Filter Buttons */}
            <div className="main-page-nav-btn d-flex flex-wrap">
                {["today", "week", "month", "year", "all"].map((filter) => (
                    <button
                        key={filter}
                        className={`btn ${dateFilter === filter ? "btn-primary" : "btn-outline-secondary"}`}
                        onClick={() => handleFilterChange(filter)}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                ))}
                <button
                    className={`btn ${dateFilter === "interval" ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => handleFilterChange("interval")}
                >
                    Interval
                </button>
            </div>

            {/* Date Range Pickers for Interval */}
            {dateFilter === "interval" && (
                <div className="d-flex ms-3">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleDateChange("start", e.target.value)}
                        className="form-control mx-2"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleDateChange("end", e.target.value)}
                        className="form-control mx-2"
                        min={startDate}
                    />
                    <button
                        className="btn btn-success mx-2"
                        onClick={validateAndApply}
                        disabled={!startDate || !endDate}
                    >
                        Apply
                    </button>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="text-danger ms-3">{errorMessage}</div>
            )}
        </div>
    );
}

export default DateFilter;
