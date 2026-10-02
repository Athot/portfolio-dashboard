const express = require("express");
const {
  getPortfolio,
  getStockPrice,
  updatePortfolioPrices,
  getStockFundamentals,
} = require("../controllers/portfolioControllers");

const router = express.Router();

router.get("/", getPortfolio);
router.get("/price", getStockPrice);
router.post("/update-prices", updatePortfolioPrices);
router.post("/fundamentals", getStockFundamentals);
module.exports = router;
