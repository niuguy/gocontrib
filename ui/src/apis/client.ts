import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:1213/api/', // Adjust with your API's base URL
  headers: {
    'Content-Type': 'application/json',
    // Include other headers like Authorization if needed
  },
});

export default apiClient;



