import axios from 'axios'

import API_URL from '../../config'

export const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  function (config) {

    if (localStorage.getItem('token2')) {
      const token2 = JSON.parse(localStorage.getItem('token2'));
      if (token2) config.headers.authorization = token2;

      return config;
    }
    else {
      const token = JSON.parse(localStorage.getItem('token'));
      if (token) config.headers.authorization = token;

      return config;
    }

  },
  function (error) {

    return Promise.reject(error);
  }
);

export const requestPromise = req => dispatch => (
  new Promise((resolve, reject) => {
    req.then(response => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(new Error(response.statusText));
      }
    })
      .catch(error => {
        if (error.response) {
          reject(error.response.data.error);
        }
      });
  })
)