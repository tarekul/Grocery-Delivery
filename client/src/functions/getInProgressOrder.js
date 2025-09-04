import axios from "axios";
import apiUrl from "../apiUrl";

const getInProgressOrder = async (customerId) => {
  const response = await axios.get(
    `${apiUrl}/order/in-progress?customerId=${customerId}`
  );

  return response.data;
};

export default getInProgressOrder;
