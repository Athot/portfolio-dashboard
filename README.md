# Portfolio Dashboard

A simple portfolio dashboard where users can upload their stock portfolio using an Excel file and view their investment performance.

## Features

- Upload portfolio data from Excel files
- View stocks grouped by sector
- Calculate total investment
- Calculate current portfolio value
- Calculate gain/loss
- Calculate portfolio percentage
- Search stocks by name
- Sort stocks by investment, CMP, and gain/loss
- View sector-wise totals
- View sector allocation chart
- Get current stock prices
- Get P/E Ratio and Latest Earnings
- Update stock prices every 15 seconds
- Cache market data to reduce repeated requests
- Handle unavailable market data without crashing the application

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Recharts
- XLSX

### Backend

- Node.js
- Express.js
- Cheerio
- Yahoo Finance
- Google Finance

## Project Structure

```text
src/
├── api/
│   └── api.js
├── components/
│   ├── SummaryCards.jsx
│   ├── PortfolioTable.jsx
│   ├── SectorGroup.jsx
│   └── ExcelUpload.jsx
├── pages/
│   └── Dashboard.jsx
├── App.jsx
├── index.css
└── main.jsx

backend/
├── controllers/
│   └── portfolioController.js
├── routes/
│   └── portfolioRoutes.js
├── services/
│   ├── marketDataService.js
│   ├── symbolService.js
│   └── fundamentalsService.js
└── server.js

How It Works
Excel File
    ↓
Excel Upload
    ↓
React Dashboard
    ↓
Node.js / Express Backend
    ↓
Yahoo Finance → Stock Price
Google Finance → P/E Ratio and Earnings
    ↓
Portfolio Calculations
    ↓
Dashboard
```

### Running the Project

## Frontend

npm install
npm run dev

## Backend

cd backend
npm install
npm run dev

## The backend runs on:

http://localhost:5000

### Data Sources

Yahoo Finance is used for stock prices.
Google Finance is used for P/E Ratio and Latest Earnings.
These are unofficial web endpoints, so the availability and response format may change.
Error Handling
If live market data is not available for a stock:

- The dashboard continues to work.
- The previous available value is kept.
- Live data unavailable is shown for that stock.
- Other stocks continue to update.
  Caching
  Market prices are temporarily cached in the backend to reduce repeated requests.
  The cache is cleared when the backend server restarts.

The portfolio is loaded from the Excel file and maintained in React state during the session. I didn't add a database because persistent portfolio storage wasn't required for the current functionality.

```

```
