const { getMultipleFundamentals } = require("../services/fundamentalServices");
const {
  getYahooPrice,
  getMultipleYahooPrices,
} = require("../services/marketDataServices");
const { getYahooSymbol } = require("../services/symbolServices");

const getPortfolio = (req, res) => {
  res.json({
    success: true,
    message: "Portfolio data fetched successfully",
    data: [],
  });
};

const getStockPrice = async (req, res) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Stock symbol is required",
      });
    }

    const marketData = await getYahooPrice(symbol);

    res.json({
      success: true,
      data: marketData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updatePortfolioPrices = async (req, res) => {
  try {
    const { stocks } = req.body;

    if (!Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Stocks array is required",
      });
    }

    const stocksWithSymbols = stocks.map((stock) => ({
      ...stock,
      symbol: getYahooSymbol(stock.exchange),
    }));

    const invalidStocks = stocksWithSymbols.filter((stock) => !stock.symbol);

    if (invalidStocks.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some stocks do not have an exchange code",
      });
    }

    const updatedStocks = await getMultipleYahooPrices(stocksWithSymbols);

    res.json({
      success: true,
      data: updatedStocks,
    });
  } catch (error) {
    console.error("Portfolio update error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update portfolio prices",
    });
  }
};

const getStockFundamentals = async (req, res) => {
  try {
    const { stocks } = req.body;

    if (!Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Stocks array is required",
      });
    }

    const fundamentals = await getMultipleFundamentals(stocks);

    res.json({
      success: true,
      data: fundamentals,
    });
  } catch (error) {
    console.error("Fundamentals controller error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch stock fundamentals",
    });
  }
};

module.exports = {
  getPortfolio,
  getStockPrice,
  updatePortfolioPrices,
  getStockFundamentals,
};
