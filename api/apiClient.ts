import axios from 'axios';

const apiClient = axios.create({
  // Replace with your LAN IP address for mobile testing
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
