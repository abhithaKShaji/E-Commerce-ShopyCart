
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentChartProps {
  paymentMethods: { COD: number; Razorpay: number };
}

const PaymentChart: React.FC<PaymentChartProps> = ({ paymentMethods }) => {
  const data = {
    labels: ["COD", "Razorpay"],
    datasets: [
      {
        data: [paymentMethods.COD, paymentMethods.Razorpay],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)"],
        borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default PaymentChart;
