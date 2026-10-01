const getYahooSymbol = (exchangeCode) => {
  if (!exchangeCode) {
    return null;
  }

  const code = String(exchangeCode).trim().toUpperCase();

  // Already a Yahoo Finance symbol
  if (code.endsWith(".NS") || code.endsWith(".BO")) {
    return code;
  }

  // Numeric values from the Excel sheet are BSE security codes
  if (/^\d+$/.test(code)) {
    return `${code}.BO`;
  }

  // Normal NSE ticker symbol
  return `${code}.NS`;
};

module.exports = {
  getYahooSymbol,
};
