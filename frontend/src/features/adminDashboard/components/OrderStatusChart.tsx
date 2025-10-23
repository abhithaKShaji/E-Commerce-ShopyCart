
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface OrderStatusChartProps {
  orderStatus: { status: string; total: number }[];
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ orderStatus }) => {
  const data = {
    labels: orderStatus.map((o) => o.status),
    datasets: [
      {
        label: "Orders",
        data: orderStatus.map((o) => o.total),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Order Status</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default OrderStatusChart;
