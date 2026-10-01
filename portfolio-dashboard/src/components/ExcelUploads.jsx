import React from "react";
import * as XLSX from "xlsx";

function ExcelUpload({ onDataLoaded }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {
          type: "array",
        });

        // Read the first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // IMPORTANT: Skip Excel row 1.
        // The actual column headings are on Excel row 2.
        const rows = XLSX.utils.sheet_to_json(worksheet, {
          range: 1,
          defval: "",
        });

        console.log("Excel headers:", Object.keys(rows[0] || {}));
        console.log("Excel data:", rows);

        let currentSector = "Other";
        const convertedStocks = [];

        rows.forEach((row, index) => {
          const name = String(row["Particulars"] || "").trim();

          if (!name) return;

          const purchasePrice = Number(row["Purchase Price"]);

          const quantity = Number(row["Qty"]);

          // Sector rows have a name but no purchase price
          // or quantity. Remember the sector for following stocks.
          if (
            !Number.isFinite(purchasePrice) ||
            !Number.isFinite(quantity) ||
            purchasePrice <= 0 ||
            quantity <= 0
          ) {
            currentSector = name;
            return;
          }

          const cmpValue = Number(row["CMP"]);

          const cmp =
            Number.isFinite(cmpValue) && cmpValue > 0
              ? cmpValue
              : purchasePrice;

          const investment =
            Number(row["Investment"]) || purchasePrice * quantity;

          const presentValue = cmp * quantity;

          const gainLoss = presentValue - investment;

          const peValue = Number(row["P/E (TTM)"]);

          convertedStocks.push({
            id: convertedStocks.length + 1,

            name: name,
            sector: currentSector,

            purchasePrice: purchasePrice,
            quantity: quantity,
            investment: investment,

            portfolioPercent: Number(row["Portfolio (%)"]) || 0,

            exchange: String(row["NSE/BSE"] || ""),

            cmp: cmp,
            presentValue: presentValue,
            gainLoss: gainLoss,

            peRatio: Number.isFinite(peValue) ? peValue : 0,

            latestEarnings: row["Latest Earnings"] || "N/A",
          });
        });

        if (convertedStocks.length === 0) {
          alert("No valid stock rows found. Please check the Excel file.");
          return;
        }

        onDataLoaded(convertedStocks);

        alert(`${convertedStocks.length} stocks imported successfully!`);
      } catch (error) {
        console.error("Excel upload error:", error);

        alert("Unable to read the Excel file. Please check the file format.");
      }
    };

    reader.readAsArrayBuffer(file);

    // Allow selecting the same file again
    event.target.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">Import Portfolio</h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-600
        file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:bg-purple-600 file:text-white
        hover:file:bg-purple-700"
      />

      <p className="text-sm text-gray-500 mt-3">
        Upload your Excel portfolio file (.xlsx or .xls).
      </p>
    </div>
  );
}

export default ExcelUpload;
