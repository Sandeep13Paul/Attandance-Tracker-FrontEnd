import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
  } from "chart.js";
  
  import { Line } from "react-chartjs-2";
  
  // ✅ Register required parts
  ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
  );
  
  export function WeeklyTrend({ data = [] }) {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No weekly data available
        </div>
      );
    }
  
    const labels = data.map((d) => d.week);
    const values = data.map((d) => d.percent);
  
    const chartData = {
      labels,
      datasets: [
        {
          label: "Weekly %",
          data: values,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99,102,241,0.2)",
          tension: 0.36,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#6366f1",
          pointHoverRadius: 7,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false, // 🔥 VERY IMPORTANT
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    };
  
    return (
        <div className="w-full h-80">
            <Line data={chartData} options={options} />
        </div>
    );
  }