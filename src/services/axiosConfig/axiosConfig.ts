// @ts-nocheck
import axios, {
  AxiosResponse,
} from 'axios';
import { store } from '../../store';

const useAxios = () =>{
  const { auth }  = store.getState()
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SYNC_OR_STREAM_BASE_URL,
  });
  // eslint-disable-next-line
    axiosInstance.interceptors.request.use((config: any ): any => {

    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers.Authorization = auth.token  ? `Bearer ${auth.token}` : null ;
    return config;
  }
  );

  axiosInstance.interceptors.response.use((response: AxiosResponse) => {
    return response;
  }
  );

  return axiosInstance
}

export default useAxios;
