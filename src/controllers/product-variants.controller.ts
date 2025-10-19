import axios from 'axios';
import { VITE_API_URL,VARIANTS_API_URL } from '../api/apiconfig';
const axiosInstance = axios.create({
    url: VITE_API_URL,
    
  });
export const getProductVariantById = async(id:string)=>
{
 try {
      const response = await axiosInstance.get(`${VITE_API_URL}/product-variants/${id}`,
        
  );
        console.log(response.data);
      return response.data;
    }
    catch(error)
    {
      console.error('Error fetching products:', error);
      return null;
    }
}