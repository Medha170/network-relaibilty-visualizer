import axios from 'axios';

const api = axios.create({
  baseURL: 'https://network-relaibilty-visualizer.onrender.com/api',
});

export default api;
