// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://meucalendarioodontoprev.azurewebsites.net', 
});

export default api;
