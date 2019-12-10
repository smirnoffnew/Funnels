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

API.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
)

const isHandlerEnabled = (config={}) => {
  return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled ? 
    false : true
}


const errorHandler = (error) => {
  if (isHandlerEnabled(error.config)) {
    // Handle errors
  }
  return Promise.reject({ ...error })
}

const successHandler = (response) => {
  if (isHandlerEnabled(response.config)) {

    if(response.data.message) {
      console.log(response.data.message)
    }
  }
  return response
}




// this.props.dispatch({
//           type: "CREATE_TOSTER",
//           payload: {
//             data: response.message,
//             id: uuid(),
//           }
//         });



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