import { Bar } from "react-chartjs-2";

export default function SubjectChart({ stats }) {
  const data = {
    labels: stats.map(s => s.subject),
    datasets: [
      {
        label: "Attendance %",
        data: stats.map(s => s.percent),
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-semibold mb-2">Subject-wise Attendance</h2>
      <Bar data={data} />
    </div>
  );
}