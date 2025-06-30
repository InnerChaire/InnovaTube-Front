import axios from 'axios';

const API = axios.create({
  baseURL: 'https://innovatube-production-1543.up.railway.app/api', // cambia si tu backend está en Railway
  withCredentials: false
});

export default API;
