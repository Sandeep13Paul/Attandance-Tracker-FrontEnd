import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AttendanceChart({ data }) {
  const monthly = {};

  data.forEach((a) => {
    const month = a.date.substring(0, 7);
    if (!monthly[month]) {
      monthly[month] = { present: 0, total: 0 };
    }
    monthly[month].total++;
    if (a.present) monthly[month].present++;
  });

  const labels = Object.keys(monthly).sort();
  const percentages = labels.map((m) =>
    monthly[m].total ? (monthly[m].present / monthly[m].total) * 100 : 0
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Attendance %",
        data: percentages,
        borderRadius: 10,
        backgroundColor: "rgba(99, 102, 241, 0.85)",
        hoverBackgroundColor: "rgba(99, 102, 241, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${Math.round(ctx.parsed.y)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (v) => `${v}%`,
        },
        grid: {
          color: "rgba(148, 163, 184, 0.25)",
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}