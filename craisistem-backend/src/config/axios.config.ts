import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.UCA_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.UCA_TOKEN}` 
  }
});