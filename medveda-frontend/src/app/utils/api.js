import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8028/homepage/testimonials',
});

export default API;
