import axios from 'axios';
  
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_SYNC_OR_STREAM_BASE_URL,
    });
  export default axiosInstance;