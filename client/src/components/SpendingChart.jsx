import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const SpendingChart = ({ transactions }) => {
  const debitTransactions = transactions
    .filter(t => t.type === 'debit')
    .slice(0, 7)
    .reverse()

  const data = {
    labels: debitTransactions.map(t => new Date(t.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Spending (₹)',
        data: debitTransactions.map(t => t.amount),
        fill: true,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Spending Analysis</h2>
      <div className="h-64">
        {debitTransactions.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No spending data to display
          </div>
        )}
      </div>
    </div>
  )
}

export default SpendingChart
