import { API } from './instance'
import axios from 'axios'
import API_URL from '../../config'

export function changeUserName(data) {
  const {
    name,
    email,
  } = data;

  // console.log(data)
  return function (dispatch) {
    API.patch(`profile`, {
      'firstName': name,
      'password': '',
      "email": email,
    })
      .then(response => {
        if (response.data) {
          // console.log(response.data)
          localStorage.setItem('userFirstName', name);

          dispatch({
            type: "SETTINGS_MESSAGE_NAME_SUCCESS",
            payload: response.data.message
          });

          setTimeout(() => {
            dispatch({ type: 'SETTINGS_MESSAGE_NAME_RESET' });
          }, 2000)

          document.getElementById("settings-wrapper").click();
        }
      })
      .catch(function (error) {
        if (error.response) {
          // console.log(error.response)
          dispatch({
            type: "SETTINGS_MESSAGE_NAME_FAILURE",
            payload: error.response.data.error
          });
        }
      });
  }
}

export function changeUserPassword(data) {
  const {
    // currentPassword,
    newPassword,
  } = data;

  // console.log('currentPassword: ', currentPassword)
  // console.log('newPassword: ', newPassword)
  return function (dispatch) {
    API.patch(`profile`, {
      "firstName": "",
      'password': newPassword,
      "email": "",
    })
      .then(response => {
        if (response.data) {
          dispatch({
            type: "SETTINGS_MESSAGE_PASSWORD_SUCCESS",
            payload: response.data.message
          });

          setTimeout(() => {
            dispatch({ type: 'SETTINGS_MESSAGE_PASSWORD_RESET' });
          }, 2000)
        }
      })
      .catch(function (error) {
        if (error.response) {
          // console.log(error.response)
          dispatch({
            type: "SETTINGS_MESSAGE_PASSWORD_FAILURE",
            payload: error.response.data.error
          });
        }
      });
  }
}

export function changeUserAvatar(avatar) {

  // console.log("avatar",avatar)

  const token = JSON.parse(localStorage.getItem('token'));

  let bodyFormData = new FormData();
  bodyFormData.append('avatar', avatar);

  return function (dispatch) {
    axios({
      method: 'patch',
      url: `${API_URL}/profile/avatar`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      },
      data: bodyFormData
    })
      .then(response => {
        if (response.data) {
          // console.log("resp", response.data)
          dispatch({
            type: "SETTINGS_MESSAGE_AVATAR_SUCCESS",
            payload: response.data.message
          });
          localStorage.setItem('userAvatar', JSON.stringify(response.data.link.photoUrl));

          setTimeout(() => {
            dispatch({ type: 'SETTINGS_MESSAGE_AVATAR_RESET' });
          }, 2000)

          document.getElementById("settings-wrapper").click();
        }
      })
      .catch(function (error) {
        if (error.response) {
          // console.log("err",error.response)
          dispatch({
            type: "SETTINGS_MESSAGE_AVATAR_FAILURE",
            payload: error.response.data.error
          });
        }
      });
  }
}