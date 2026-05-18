import axios from 'axios';

const API = axios.create({
    // Backend port
  baseURL: 'https://localhost:7007/api',  
});

export default API;