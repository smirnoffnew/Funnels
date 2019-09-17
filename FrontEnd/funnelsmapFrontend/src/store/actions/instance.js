import axios from 'axios'

import { API_URL } from '../../config'

export const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  function (config) {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) config.headers.authorization = token;

    return config;
  },
  function (error) {

    return Promise.reject(error);
  }
);