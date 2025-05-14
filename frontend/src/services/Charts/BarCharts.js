import Chart from "chart.js/auto";

export class BarCharts {
    constructor(data) {
        this.incomeData = data.filter(item => item.type === 'income');
        this.expenseData = data.filter(item => item.type === 'expense');

        this.renderChart("myChart1", this.incomeData, "Income");
        this.renderChart("myChart2", this.expenseData, "Expenses");
    }

    renderChart(canvasId, data, label) {
        const chartElement = document.getElementById(canvasId);
        if (!chartElement) return;

        const existingChart = Chart.getChart(canvasId);
        if (existingChart) existingChart.destroy();

        if (data.length === 0) return;

        const amounts = data.map(item => item.amount);
        const labels = data.map(item => item.comment || "No Category");

        new Chart(chartElement, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label,
                    data: amounts,
                    backgroundColor: "#007bff",
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                }
            },
        });
    }
}
