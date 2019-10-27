import { API } from './instance'
import { push } from 'connected-react-router'
import axios from 'axios'
import API_URL from '../../config'

export function addCollaborator(tokenCollaborator) {
  const token = JSON.parse(localStorage.getItem('token'));

  const postData = {
    // 'password': password
  };

  const axiosConfig = {
    headers: {
      'collaborate-confirm': tokenCollaborator,
      'authorization': token
    },
  };

  return function (dispatch) {
    axios.post(`${API_URL}/collaborator`, postData, axiosConfig)
      .then(response => {
        dispatch({ type: 'ADD_COLLABORATOR_RESET' });
        dispatch({
          type: 'ADD_COLLABORATOR',
          payload: response.data.data
        });
        dispatch({ type: 'ADD_COLLABORATOR_SUCCESS' });
        dispatch(push('/collaborations'));
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'ADD_COLLABORATOR_FAILURE',
            payload: error.response.data.message
          });
        }
      });
  }
}


export function getAllFunnelsCollaboration() {
  return function (dispatch) {
    API.get(`funnel`)
      .then(response => {
        dispatch({
          type: 'GET_ALL_FUNNELS_COLLABORATION',
          payload: response.data.data
        });
        dispatch({ type: 'GET_ALL_FUNNELS_COLLABORATION_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'GET_ALL_FUNNELS_COLLABORATION_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getAllCollaboratorsForFunnels(funnelsId) {
  return function (dispatch) {
    API.post(`collaborator`, {
      'funnelsId': funnelsId
    })
      .then(response => {
        dispatch({
          type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS',
          payload: response.data
        });
        dispatch({ type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getAllCollaborators(funnelId) {
  return function (dispatch) {
    API.get(`collaborator/funnel/${funnelId}`)
      .then((response) => {
        // console.log('colloborators', {collaborators: response.data[0].collaborators,
        //   funnelAuthor: response.data[0].funnelAuthor})
        dispatch({
          type: 'GET_ALL_COLLABORATORS_OF_CURRENT_FUNNEL',
          collaborators: response.data[0].collaborators,
          funnelAuthor: response.data[0].funnelAuthor
        })
      })
  }
}

export function resetAllCollaboratorsForFunnels() {
  return function (dispatch) {
    dispatch({ type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS_RESET' });
  }
}
