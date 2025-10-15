import axios from 'axios';
import { ORDERS_API_URL, VITE_API_URL } from '../api/apiconfig';

const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
  });
 export const getAllProducts = async ()=>
  {
    try {
      const response = await axiosInstance.get(`${VITE_API_URL}/products`
  );
      return response.data.data;
    }
    catch(error)
    {
      console.error('Error fetching products:', error);
      return null;
    }
  }

export const createOrder = async (formData: any) => {
  try {
    const result = await axios.post(ORDERS_API_URL, formData);
   return {
    "success": true,
    "data" : result.data,
    "message" : "Order placed successfully!"
   }
    
  } catch (error:any) {
    
    throw error;
  }


}



