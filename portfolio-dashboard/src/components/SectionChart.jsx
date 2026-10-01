import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
];

function SectorChart({ stocks }) {
  // Calculate investment for each sector
  const sectorData = Object.values(
    stocks.reduce((groups, stock) => {
      const investment = stock.purchasePrice * stock.quantity;

      if (!groups[stock.sector]) {
        groups[stock.sector] = {
          name: stock.sector,
          value: 0,
        };
      }

      groups[stock.sector].value += investment;

      return groups;
    }, {}),
  );

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Sector Allocation
      </h2>

      <p className="mb-6 text-sm text-gray-500">
        Investment distribution across sectors
      </p>

      <div className="h-80 w-full">
        {sectorData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
              >
                {sectorData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex h-full items-center justify-center text-gray-500">
            No sector data available.
          </p>
        )}
      </div>
    </div>
  );
}

export default SectorChart;
