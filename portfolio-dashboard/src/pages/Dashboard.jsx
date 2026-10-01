import React, { useEffect, useState } from "react";
import PortfolioTable from "../components/PortfolioTable";
import SummaryCards from "../components/SummaryCards";
import SectorChart from "../components/SectionChart";
import ExcelUpload from "../components/ExcelUploads";
import { getFundamentals, updatePrices } from "../api/api";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  // Update CMP every 15 seconds
  useEffect(() => {
    const fetchFundamentals = async () => {
      const stocksWithExchange = stocks.filter((stock) => stock.exchange);

      if (stocksWithExchange.length === 0) {
        return;
      }

      try {
        const data = await getFundamentals({
          stocks: stocks.map((stock) => ({
            name: stock.name,
            symbol: stock.exchange,
          })),
        });
        console.log(data);
        if (!data.success) {
          console.error(data.message);
          return;
        }

        setStocks((currentStocks) =>
          currentStocks.map((stock) => {
            const updatedStock = data.data.find(
              (item) => item.symbol === `${stock.exchange}.NS`,
            );

            if (!updatedStock) {
              return stock;
            }

            return {
              ...stock,
              peRatio: updatedStock.peRatio,
              latestEarnings: updatedStock.latestEarnings,
            };
          }),
        );
      } catch (error) {
        console.error("Failed to fetch fundamentals:", error);
      }
    };

    fetchFundamentals();
  }, [stocks.length]);

  // update stocks
  useEffect(() => {
    const fetchUpdatedPrices = async () => {
      if (stocks.length === 0) {
        return;
      }

      try {
        setIsUpdating(true);
        setApiError("");

        const data = await updatePrices({
          stocks: stocks.map((stock) => ({
            name: stock.name,
            exchange: stock.exchange,
          })),
        });

        if (!data.success) {
          setApiError(data.message || "Unable to update market prices.");
          return;
        }

        setStocks((currentStocks) =>
          currentStocks.map((stock) => {
            const updatedStock = data.data.find(
              (item) => item.name === stock.name,
            );

            if (!updatedStock || updatedStock.cmp === null) {
              return {
                ...stock,
                marketDataError: true,
              };
            }

            const presentValue = updatedStock.cmp * stock.quantity;

            const gainLoss = presentValue - stock.investment;

            return {
              ...stock,
              cmp: updatedStock.cmp,
              presentValue,
              gainLoss,
              marketDataError: false,
            };
          }),
        );

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to update prices:", error);

        setApiError(
          "Unable to update market prices. Showing the last available values.",
        );
      } finally {
        setIsUpdating(false);
      }
    };

    fetchUpdatedPrices();

    const interval = setInterval(fetchUpdatedPrices, 15000);

    return () => clearInterval(interval);
  }, [stocks.length]);
  // search stocks by company name
  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (sortBy === "investment") {
      return b.purchasePrice * b.quantity - a.purchasePrice * a.quantity;
    }

    if (sortBy === "cmp") {
      return b.cmp - a.cmp;
    }
    if (sortBy === "gainLoss") {
      const gainA = a.cmp * a.quantity - a.purchasePrice * a.quantity;

      const gainB = b.cmp * b.quantity - b.purchasePrice * b.quantity;

      return gainB - gainA;
    }

    return 0;
  });
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Portfolio Dashboard
      </h1>

      <p className="mb-8 text-gray-500">
        Track your investment and portfolio performance
      </p>
      <div className="mb-6">
        {isUpdating && (
          <p className="text-sm text-blue-600">Updating market data...</p>
        )}

        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        {!isUpdating && lastUpdated && !apiError && (
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* excel imports */}
      <div className="mb-8">
        <ExcelUpload onDataLoaded={setStocks} />
      </div>
      <SummaryCards stocks={stocks} />
      <SectorChart stocks={stocks} />
      {/* Search and Sort */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {" "}
        <input
          type="text"
          placeholder="Search stocks by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 sm:max-w-xs"
        >
          <option value="">Sort By</option>
          <option value="investment">Investment: High to Low</option>
          <option value="cmp">CMP: High to Low</option>
          <option value="gainLoss">Gain/Loss: High to Low</option>
        </select>
      </div>

      {/* Portfolio Table */}
      <PortfolioTable stocks={sortedStocks} />

      {sortedStocks.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No stocks found.</p>
      )}
    </div>
  );
};

export default Dashboard;
