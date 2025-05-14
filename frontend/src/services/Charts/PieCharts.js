import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
export class PieCharts {
    incomeData = [];
    expenseData = [];

    colorPalette = ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD', '#6610f2', '#6f42c1', '#e83e8c'];
    usedColors = [];

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
        if (existingChart) {
            existingChart.destroy();
        }

        if (data.length === 0) {
            console.warn(`No data available for ${label}`);
            return;
        }

        const amounts = data.map(item => item.amount);
        const labels = data.map(item => item.comment || "No Category");
        const backgroundColors = labels.map(() => this.getUniqueColor());

        new Chart(chartElement, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label,
                    data: amounts,
                    backgroundColor: backgroundColors,
                }]
            },
            options: {
                responsive: true,
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: $${value}`;
                            }
                        }
                    },
                    legend: { position: 'top' },
                    datalabels: {
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = (value / total * 100).toFixed(1) + '%';
                            return percentage;
                        },
                        color: '#fff',
                    }
                }
            },
        });
    }

    getUniqueColor() {
        if (this.usedColors.length === this.colorPalette.length) {
            console.warn("All colors used, reusing first color.");
            return this.colorPalette[0];
        }

        let color;
        do {
            color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        } while (this.usedColors.includes(color));

        this.usedColors.push(color);
        return color;
    }
}
