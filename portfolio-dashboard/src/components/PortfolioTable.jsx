import React from "react";

const PortfolioTable = ({ stocks }) => {
  const totalInvestment = stocks.reduce(
    (total, stock) => total + stock.purchasePrice * stock.quantity,
    0,
  );

  // Group stocks by sector
  const groupedStocks = stocks.reduce((groups, stock) => {
    if (!groups[stock.sector]) {
      groups[stock.sector] = [];
    }

    groups[stock.sector].push(stock);

    return groups;
  }, {});

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold text-gray-900">My Holdings</h2>

        <p className="mt-1 text-sm text-gray-500">
          Track your stock investments and performance.
        </p>
      </div>

      <div className="max-h-[600px] overflow-auto">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-4">Particulars</th>
              <th className="px-4 py-4">Purchase Price</th>
              <th className="px-4 py-4">Qty</th>
              <th className="px-4 py-4">Investment</th>
              <th className="px-4 py-4">Portfolio %</th>
              <th className="px-4 py-4">CMP</th>
              <th className="px-4 py-4">Present Value</th>
              <th className="px-4 py-4">Gain/Loss</th>
              <th className="px-4 py-4">P/E Ratio</th>
              <th className="px-4 py-4">Latest Earnings</th>
              <th className="px-4 py-3">Exchange</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {Object.entries(groupedStocks).map(([sector, sectorStocks]) => {
              // Calculate sector totals
              const sectorInvestment = sectorStocks.reduce(
                (total, stock) => total + stock.purchasePrice * stock.quantity,
                0,
              );

              const sectorPresentValue = sectorStocks.reduce(
                (total, stock) => total + stock.cmp * stock.quantity,
                0,
              );

              const sectorGainLoss = sectorPresentValue - sectorInvestment;

              return (
                <React.Fragment key={sector}>
                  {/* Sector heading */}
                  <tr className="bg-blue-50">
                    <td
                      colSpan={11}
                      className="px-4 py-3 font-bold text-blue-900"
                    >
                      {sector}
                    </td>
                  </tr>

                  {/* Stocks belonging to this sector */}
                  {sectorStocks.map((stock) => {
                    const investment = stock.purchasePrice * stock.quantity;

                    const presentValue =
                      stock.cmp !== null && stock.cmp !== undefined
                        ? stock.cmp * stock.quantity
                        : 0;

                    const gainLoss = presentValue - investment;

                    const portfolioPercentage =
                      totalInvestment > 0
                        ? (investment / totalInvestment) * 100
                        : 0;

                    return (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900">
                          {stock.name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          ₹{stock.purchasePrice.toLocaleString("en-IN")}
                        </td>

                        <td className="px-4 py-4">{stock.quantity}</td>

                        <td className="whitespace-nowrap px-4 py-4">
                          ₹{investment.toLocaleString("en-IN")}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {portfolioPercentage.toFixed(2)}%
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {stock.cmp !== null && stock.cmp !== undefined ? (
                            <div>
                              <div>₹{stock.cmp.toLocaleString("en-IN")}</div>

                              {stock.marketDataError && (
                                <div className="mt-1 text-xs text-orange-500">
                                  Live data unavailable
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-orange-500">Unavailable</span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          ₹{presentValue.toLocaleString("en-IN")}
                        </td>

                        <td
                          className={`whitespace-nowrap px-4 py-4 font-semibold ${
                            gainLoss >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {gainLoss >= 0 ? "+" : "-"}₹
                          {Math.abs(gainLoss).toLocaleString("en-IN")}
                        </td>

                        <td className="px-4 py-4">{stock.peRatio}</td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {stock.latestEarnings}
                        </td>
                        <td className="px-4 py-3">{stock.exchange || "-"}</td>
                      </tr>
                    );
                  })}

                  {/* Sector totals */}
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan={3} className="px-4 py-3 text-gray-700">
                      {sector} Total
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      ₹{sectorInvestment.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3">
                      {totalInvestment > 0
                        ? ((sectorInvestment / totalInvestment) * 100).toFixed(
                            2,
                          )
                        : "0.00"}
                      %
                    </td>

                    <td className="px-4 py-3">—</td>

                    <td className="whitespace-nowrap px-4 py-3">
                      ₹{sectorPresentValue.toLocaleString("en-IN")}
                    </td>

                    <td
                      className={`whitespace-nowrap px-4 py-3 ${
                        sectorGainLoss >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {sectorGainLoss >= 0 ? "+" : "-"}₹
                      {Math.abs(sectorGainLoss).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;
