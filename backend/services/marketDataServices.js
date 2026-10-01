const priceCache = new Map();
const CACHE_DURATION = 10000;
const getYahooPrice = async (symbol) => {
  try {
    const cachedData = priceCache.get(symbol);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol,
    )}?range=1d&interval=1m`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance request failed: ${response.status}`);
    }

    const data = await response.json();

    const result = data?.chart?.result?.[0];

    if (!result) {
      throw new Error(`No Yahoo Finance data found for ${symbol}`);
    }

    const price = result?.meta?.regularMarketPrice;

    if (price === undefined || price === null) {
      throw new Error(`No current price found for ${symbol}`);
    }
    const marketData = {
      symbol,
      price: Number(price),
      currency: result.meta.currency,
    };

    priceCache.set(symbol, {
      data: marketData,
      timestamp: Date.now(),
    });

    return marketData;
  } catch (error) {
    console.error(`Yahoo Finance error for ${symbol}:`, error.message);

    throw new Error(`Unable to fetch market data for ${symbol}`);
  }
};
const getMultipleYahooPrices = async (stocks) => {
  const results = await Promise.all(
    stocks.map(async (stock) => {
      try {
        const marketData = await getYahooPrice(stock.symbol);

        return {
          ...stock,
          cmp: marketData.price,
          currency: marketData.currency,
        };
      } catch (error) {
        return {
          ...stock,
          cmp: null,
          error: error.message,
        };
      }
    }),
  );

  return results;
};
module.exports = {
  getYahooPrice,
  getMultipleYahooPrices,
};
