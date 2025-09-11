import axios from "axios";
import apiUrl from "../apiUrl";

const getPastOrders = async (customerId) => {
  try {
    const response = await axios.get(`${apiUrl}/past-orders/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching past orders:", error);
    throw error;
  }
};

export default getPastOrders;
