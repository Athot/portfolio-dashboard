const cheerio = require("cheerio");

const getFundamentals = async (stock) => {
  try {
    const symbol = stock.symbol.replace(".NS", "");

    const url = `https://www.google.com/finance/quote/${symbol}:NSE?hl=en`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Finance request failed: ${response.status}`);
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    const pageText = $("body").text();
    console.log("GOOGLE FINANCE PAGE TEXT:");
    console.log(pageText);

    const peMatch = pageText.match(/P\/E ratio\s*([\d.]+)/i);

    const peRatio = peMatch ? Number(peMatch[1]) : null;
    const fiscalMatch = pageText.match(/Fiscal period\s*(Q[1-4]\s+\d{4})/i);

    const latestEarnings = fiscalMatch ? fiscalMatch[1] : null;
    return {
      symbol: stock.symbol,
      peRatio,
      latestEarnings,
    };
  } catch (error) {
    console.error(`Fundamentals error for ${stock.symbol}:`, error.message);

    return {
      symbol: stock.symbol,
      peRatio: null,
      latestEarnings: null,
      error: error.message,
    };
  }
};

const getMultipleFundamentals = async (stocks) => {
  const results = await Promise.all(
    stocks.map((stock) => getFundamentals(stock)),
  );

  return results;
};

module.exports = {
  getFundamentals,
  getMultipleFundamentals,
};
