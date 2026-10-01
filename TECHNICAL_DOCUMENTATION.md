# Technical Documentation

## Application Overview

This application is a portfolio dashboard where users can upload their stock portfolio through an Excel file and view investment details such as CMP, Present Value, Gain/Loss, P/E Ratio, and Latest Earnings.

The frontend is built using React, and Node.js with Express is used for handling market data requests.

## Key Challenges Faced

### 1. Excel Data Handling

The Excel file had grouped sector information and different types of stock identifiers. The application needed to correctly read the Excel data and convert it into a format that could be displayed in the dashboard.

### 2. Market Data

Getting current stock prices and fundamental information was challenging because Yahoo Finance and Google Finance do not provide simple official public APIs for all the required data. The application therefore uses their available web endpoints.

### 3. Automatic Updates

The CMP needs to update regularly. I implemented a 15-second update interval and recalculate the Present Value and Gain/Loss whenever new market data is received.

### 4. Error Handling

Some stock symbols may not be available through the external market-data source. Instead of stopping the entire application, the dashboard keeps the previous value and shows `Live data unavailable` for the affected stock.

### 5. API Requests and Caching

Since market data is requested regularly, I added a simple in-memory cache to reduce unnecessary requests to Yahoo Finance.

## Application

The final application provides a simple way to upload a portfolio, track stock performance, view sector allocation, and monitor changes in portfolio value.
