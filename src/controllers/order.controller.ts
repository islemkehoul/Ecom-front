import axios from 'axios';
import { ORDERS_API_URL } from '../api/apiconfig';

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