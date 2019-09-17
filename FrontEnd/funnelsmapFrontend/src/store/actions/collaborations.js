import { API } from './instance'
import { push } from 'connected-react-router'
import axios from 'axios'
import { API_URL } from '../../config'

export function addCollaborator(tokenCollaborator) {
  // console.log('addCollaborator fun')
  const token = JSON.parse(localStorage.getItem('token'));
  // console.log(tokenCollaborator)

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

        // console.log('response.data.data: ', response.data.data)

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
          // console.log(error.response)
          dispatch({
            type: 'GET_ALL_FUNNELS_COLLABORATION_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getAllCollaboratorsForFunnels(funnelsId) {
  // console.log('funnelsId: ', funnelsId)
  return function (dispatch) {
    API.post(`collaborator`, {
      'funnelsId': funnelsId
    })

      // axios.get('/api', {
      //   params: {
      //     foo: 'bar'
      //   }
      // });

      .then(response => {
        // console.log('getAllCollaboratorsForFunnels action: ',response.data)
        dispatch({
          type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS',
          payload: response.data
        });
        dispatch({ type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          // console.log(error.response)
          dispatch({
            type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function resetAllCollaboratorsForFunnels() {
  return function (dispatch) {
    dispatch({ type: 'GET_ALL_COLLABORATORS_FOR_FUNNELS_RESET' });
  }
}
