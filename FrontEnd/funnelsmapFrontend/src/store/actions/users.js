import { API } from './instance'
import { push } from 'connected-react-router'
import axios from 'axios'
import { API_URL } from '../../config'


export function getAllOwners() {
  const token = JSON.parse(localStorage.getItem('token'));
  return function (dispatch) {
    axios({
      method: 'get',
      url: `${API_URL}/profile/owners`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      }
    })
      .then(response => {
        if (response.data) {
          localStorage.setItem('multiSession', JSON.stringify(response.data.owners))
        }
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: "GET_ALL_OWNERS_MESSAGE_ERROR",
            payload: error.response.data.error
          });
          setTimeout(() => {
            dispatch({ type: 'GET_ALL_OWNERS_MESSAGE_ERROR_RESET' });
          }, 2000)
        }
      });
  }
}

export function getAllPartners() {
  return function (dispatch) {
    API.get(`profile/partners`)
      .then(response => {
        console.log('getAllPartners: ', response.data)

        dispatch({
          type: 'RESET_ALL_USERS'
        });
        dispatch({
          type: 'GET_ALL_USERS',
          payload: response.data.myPartners
        });

      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: "GET_ALL_USERS_MESSAGE_ERROR",
            payload: error.response.data.error
          });
          setTimeout(() => {
            dispatch({ type: 'GET_ALL_USERS_MESSAGE_ERROR_RESET' });
          }, 2000)
        }
      });
  }
}

export function deleteUser(id) {
  return function (dispatch) {
    API.delete(`profile/partners/${id}`)
      .then(() => {
      dispatch({
        type: "DELETE_USER",
        payload: id
      });
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response)
        dispatch({ 
          type: "DELETE_USER_MESSAGE_ERROR",
          payload: error.response.data.error
        });
        setTimeout(() => {
          dispatch({ type: 'DELETE_USER_MESSAGE_ERROR_RESET' });
        }, 2000)
      }
    });
  }
}

export function changePermissionForUser(data, id) {
  const {
    changePermissions
  } = data;

  console.log('changePermissionForUser',data, id)
  return function (dispatch) {
    API.patch(`profile/partners/${id}`, {
      'permissions': changePermissions,
    })
      .then(response => {
        if (response.data) {
          // console.log(response.data)

          dispatch({
            type: "CHANGE_PERMISSION_FOR_USER_MESSAGE",
            payload: response.data.message
          });
          setTimeout(() => {
            dispatch({ type: 'CHANGE_PERMISSION_FOR_USER_MESSAGE_RESET' });
          }, 2000)

          document.getElementById("settings-wrapper").click();
        }
      })
      .catch(function (error) {
        if (error.response) {
          // console.log(error.response)
          dispatch({
            type: "CHANGE_PERMISSION_FOR_USER_MESSAGE",
            payload: error.response.data.error
          });
          setTimeout(() => {
            dispatch({ type: 'CHANGE_PERMISSION_FOR_USER_MESSAGE_RESET' });
          }, 2000)
        }
      });
  }
}

export function generatingLinkToAddUser(data) {
  const {
    setPermissions
  } = data
  console.log('setPermissions', setPermissions)
  return function (dispatch) {
    API.post(`profile/partners/link`, {
      // 'token': JSON.parse(localStorage.getItem('token')),
      'permissions': setPermissions
    })
      .then(response => {
        console.log('generatingLinkToAddUser: ', response.data)
        dispatch({
          type: 'GENERATION_LINK_TO_ADD_USER_MESSAGE',
          payload: response.data.message
        });

        dispatch({
          type: 'GENERATED_LINK_TO_ADD_USER',
          payload: response.data.data
        })

        setTimeout(() => {
          dispatch({ type: 'GENERATION_LINK_TO_ADD_USER_MESSAGE_RESET' });
        }, 2000)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GENERATION_LINK_TO_ADD_USER_MESSAGE',
            payload: error.response.data.error
          });
          setTimeout(() => {
            dispatch({ type: 'GENERATION_LINK_TO_ADD_USER_MESSAGE_RESET' });
          }, 2000)
        }
      });
  }
}

export function addPartner(tokenPartner) {


  return function (dispatch) {
    API.get(`profile/partners/add-me-like-partner/${tokenPartner}`, {
      // 'partnerTokenId': tokenPartner
    })
      .then(response => {
        // dispatch({ type: 'ADD_PARTNER_RESET' });
        // dispatch({
        //   type: 'ADD_PARTNER',
        //   payload: response.data.data
        // });
        dispatch({
          type: 'ADD_PARTNER_MESSAGE',
          payload: response.data.message
        });
        console.log('zaebis', response.data)
        dispatch(push('/'));
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'ADD_PARTNER_MESSAGE',
            payload: error.response.data.message
          });
        }
      });
  }
}