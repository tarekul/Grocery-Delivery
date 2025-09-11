import axios from "axios";
import apiUrl from "../apiUrl";

const getActiveOrders = async (customerId) => {
  try {
    const response = await axios.get(`${apiUrl}/orders/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching active orders:", error);
    throw error;
  }
};

export default getActiveOrders;
