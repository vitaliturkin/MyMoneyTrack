import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";
import { PieCharts } from "../services/Charts/PieCharts";
import { BarCharts } from "../services/Charts/BarCharts";
import { PolarCharts } from "../services/Charts/PolarCharts";
import DateFilter from "../services/Filter/DateFilter";
import { useOperations } from "../services/Filter/Operations";

function Dashboard() {
    const savedDateFilter = localStorage.getItem("dateFilter") || "today";
    const savedStartDate = localStorage.getItem("startDate") || "";
    const savedEndDate = localStorage.getItem("endDate") || "";

    const [chartType, setChartType] = useState("pie");
    const [dateFilter, setDateFilter] = useState(savedDateFilter);
    const [startDate, setStartDate] = useState(savedStartDate);
    const [endDate, setEndDate] = useState(savedEndDate);

    const { filteredOperations } = useOperations(dateFilter, startDate, endDate);


    useEffect(() => {
        clearCharts(); // removing previous charts

        if (filteredOperations.length > 0) {
            if (chartType === "pie") {
                new PieCharts(filteredOperations);
            } else if (chartType === "bar") {
                new BarCharts(filteredOperations);
            } else if (chartType === "polar") {
                new PolarCharts(filteredOperations);
            }
        }
    }, [filteredOperations, chartType]);

    // function to Clear Previous Charts
    const clearCharts = () => {
        ["myChart1", "myChart2"].forEach((chartId) => {
            const chart = Chart.getChart(chartId);
            if (chart) {
                chart.destroy();
            }
        });
    };

    return (
        <div className="container my-5">
            <h1 className="main-page-title">Dashboard</h1>

            {/* date filtering component */}
            <DateFilter onFilterChange={(filter, start, end) => {
                setDateFilter(filter);
                setStartDate(start);
                setEndDate(end);
            }} />

            {/* chart type buttons */}
            <div className="main-page-nav d-flex flex-row justify-content-end mb-5">
                <button className={`btn ${chartType === "pie" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setChartType("pie")}>
                    <svg width="25" height="25" viewBox="0 0 167 167" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M83.1531 0C37.4189 0 0 37.4189 0 83.1531C0 128.887 37.4189 166.306 83.1531 166.306C128.887 166.306 166.306 128.887 166.306 83.1531C166.306 37.4189 128.887 0 83.1531 0ZM83.1531 20.7883C117.662 20.7883 145.518 48.6446 145.518 83.1531C145.518 117.662 117.662 145.518 83.1531 145.518V20.7883Z" fill="black"/>
                    </svg>
                </button>
                <button className={`btn ${chartType === "bar" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setChartType("bar")}>
                    <svg width="25" height="25" viewBox="0 0 167 146" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0V145.518H166.306V124.73H20.7883V0H0ZM103.941 0V103.941H145.518V0H103.941ZM41.5766 41.5765V103.941H83.1531V41.5765H41.5766Z" fill="black"/>
                    </svg>
                </button>
                <button className={`btn ${chartType === "polar" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setChartType("polar")}>
                    <svg width="25" height="25" viewBox="0 0 168 167" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M73.7302 0.240601C53.5655 0.240601 35.4797 8.55591 22.3831 21.6525L84.1243 83.3937V0.864249C80.7982 0.448483 77.2642 0.240601 73.7302 0.240601ZM104.913 22.2762V93.1642L48.3685 149.708C61.0493 160.102 76.8484 166.547 94.5184 166.547C134.64 166.547 167.277 133.909 167.277 93.7878C167.277 57.2005 140.045 27.4732 104.913 22.2762ZM19.8885 49.5088C8.24709 60.7345 0.971191 76.3257 0.971191 93.7878C0.971191 113.745 10.5338 130.999 25.0856 142.432L69.3646 98.1534L19.8885 49.5088Z" fill="black"/>
                    </svg>
                </button>
            </div>

            {/* showing "No Operations" message if no data */}
            {filteredOperations.length === 0 ? (
                <div className="alert alert-warning text-center my-4">
                    No operations found for the selected date range.
                </div>
            ) : (
                // showing charts only when there is data
                <div className="main-page-charts d-flex">
                    <div className="main-page-chart me-5">
                        <div className="main-page-chart-title">Income</div>
                        <canvas id="myChart1"></canvas>
                    </div>
                    <div className="main-page-chart-line mx-3"></div>
                    <div className="main-page-chart">
                        <div className="main-page-chart-title">Expenses</div>
                        <canvas id="myChart2"></canvas>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
