import React from "react";

const SummaryCards = ({ stocks }) => {
  const totalInvestment = stocks.reduce(
    (total, stock) => total + stock.purchasePrice * stock.quantity,
    0,
  );

  const currentValue = stocks.reduce(
    (total, stock) => total + stock.cmp * stock.quantity,
    0,
  );
  const profitLoss = currentValue - totalInvestment;
  const cards = [
    {
      title: "Total Investment",
      value: totalInvestment,
      color: "text-blue-600",
    },
    {
      title: "Current Value",
      value: currentValue,
      color: "text-purple-600",
    },
    {
      title: "Total Profit / Loss",
      value: profitLoss,
      color: profitLoss >= 0 ? "text-green-600" : "text-red-600",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          key={card.key}
        >
          <p className="text-sm text-gray-500">{card.title}</p>
          <h2 className={`mt-2 text-2xl font-bold ${card.color}`}>
            ₹{card.value.toLocaleString("en-IN")}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
