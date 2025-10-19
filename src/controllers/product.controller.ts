import axios from 'axios';
import { VITE_API_URL } from '../api/apiconfig';

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
 export const getProductByID = async (id: string) =>
  {
    try {
      const response = await axiosInstance.get(`${VITE_API_URL}/products/${id}`
  );
  console.log('Fetched product:', response.data);
      return response.data;
    }
    catch(error)
    {
      console.error('Error fetching products:', error);
      return null;
    }
  }





