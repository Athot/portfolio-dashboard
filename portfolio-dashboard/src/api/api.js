import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updatePrices = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/portfolio/update-prices`, data);

    console.log("Updated prices:", res.data);

    return res.data;
  } catch (error) {
    console.error("Price update error:", error);
    throw error;
  }
};

export const getFundamentals = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/portfolio/fundamentals`, data);

    console.log("Fundamentals:", res.data);

    return res.data;
  } catch (error) {
    console.error("Fundamentals API error:", error);

    throw error;
  }
};
