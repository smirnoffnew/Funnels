import axios from 'axios'
import { push } from 'connected-react-router'
import {
  GET_ALL_PROJECTS,
  GET_ALL_PROJECTS_SUCCESS,
  GET_ALL_PROJECTS_FAILURE,
  DELETE_PROJECT,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_FAILURE,
} from './types/index';
import API_URL from '../../config'
import { API, requestPromise } from './instance'
import uuid from 'uuid'


export function getAllProjects() {
  return function (dispatch) {
    API.get(`project`)
      .then(response => {
        dispatch({ type: 'RESET_ALL_PROJECTS' });
        // console.log('getAllProjects: ', response.data)
        dispatch({
          type: GET_ALL_PROJECTS,
          payload: response.data.data
        });
        dispatch({
          type: 'GET_ALL_PROJECTS_LIMIT',
          payload: response.data.limit
        });
        dispatch({ type: GET_ALL_PROJECTS_SUCCESS });
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status === 403) {
            localStorage.clear();
            dispatch({ type: 'UN_AUTH_USER' });
          }
          dispatch({
            type: GET_ALL_PROJECTS_FAILURE,
            payload: error.response.data.error
          });
        }
      });
  }
}

export const updateProjectsBySearch = updateProjects => dispatch => {
  dispatch({ type: GET_ALL_PROJECTS, payload: updateProjects });
}

export function getAllTemplates() {
  return function (dispatch) {
    API.get(`template`)
      .then(response => {

        dispatch({
          type: 'GET_ALL_TEMPLATES',
          payload: response.data.data
        });
        dispatch({ type: 'GET_ALL_TEMPLATES_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: GET_ALL_PROJECTS_FAILURE,
            payload: error.response.data.error
          });
        }
      });
  }
}

export function deleteProjectByUserId(id) {
  return function (dispatch) {
    API.delete(`project/${id}`)
      .then((response) => {
        dispatch({
          type: DELETE_PROJECT,
          payload: id
        });
        dispatch({ type: DELETE_PROJECT_SUCCESS });
        dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: response.data.message,
            id: uuid(),
          }
        });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: DELETE_PROJECT_FAILURE,
            payload: error.response.data.error
          });
          dispatch({
            type: "CREATE_TOSTER",
            payload: {
              data: error.response.data.error,
              id: uuid(),
            }
          });
        }
      });
  }
}

export const createProjectWithPromisefication = (
  projectName 
) => (
  requestPromise(
    API.post(`project`, {
      'projectName': projectName,
    })
  )
)

export const createFunnelWithPromisefication = (
  projectName, 
  projectId
) => (
  requestPromise(
    API.post(`funnel/${projectId}`, {
      'funnelName': projectName,
    })
  )
)
 

export function getAllFunnels(projectId) {
  return function (dispatch) {
    API.get(`funnel/${projectId}`)
      .then(response => {
        let res = response.data.data;
        let limit = response.data.limit;
        // console.log('getAllFunnels: ', response.data)
        dispatch({
          type: 'RESET_ALL_FUNNELS',
          payload: {
            projectId
          }
        });
        dispatch({
          type: 'GET_ALL_FUNNELS',
          payload: {
            projectId,
            res,
          }
        });
        dispatch({
          type: 'GET_ALL_FUNNELS_LIMIT',
          payload: {
            projectId,
            limit,
          }
        });
        dispatch({ type: 'GET_ALL_FUNNELS_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GET_ALL_FUNNELS_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function deleteFunnel(project_id, funnel_id) {
  return function (dispatch) {
    API.delete(`funnel/${project_id}/${funnel_id}`)
      .then((response) => {
        dispatch({
          type: 'DELETE_FUNNEL',
          payload: {
            project_id,
            funnel_id
          }
        });
        dispatch({ type: 'DELETE_FUNNEL_SUCCESS' });
        dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: response.data.message,
            id: uuid(),
          }
        });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'DELETE_FUNNEL_FAILURE',
            payload: error.response.data.error
          });
          dispatch({
            type: "CREATE_TOSTER",
            payload: {
              data: error.response.data.error,
              id: uuid(),
            }
          });
        }
      });
  }
}

export function deleteTemplate(template_id) {
  return function (dispatch) {
    API.delete(`template/${template_id}`)
      .then((response) => {
        dispatch({
          type: 'DELETE_TEMPLATE',
          payload: template_id,
        });
        dispatch({ type: 'DELETE_TEMPLATE_SUCCESS' });
        dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: response.data.message,
            id: uuid(),
          }
        });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'DELETE_TEMPLATE_FAILURE',
            payload: error.response.data.error
          });
          dispatch({
            type: "CREATE_TOSTER",
            payload: {
              data: error.response.data.error,
              id: uuid(),
            }
          });
        }
      });
  }
}

export function createLink(funnelsId, permissions) {
  return function (dispatch) {
    API.post(`funnel/url`, {
      'funnelsId': funnelsId,
      'permissions': permissions,
    })
      .then(response => {
        dispatch({
          type: 'CREATE_LINK',
          payload: response.data.data
        })
        dispatch({ type: 'CREATE_LINK_SUCCESS' });
        dispatch({
          type: "CREATE_TOSTER",
          payload: {
            data: response.data.message,
            id: uuid(),
          }
        });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'CREATE_LINK_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const createUTMLinkWithPromisefication = (funnelId, nodeId, url) => dispatch => {
  return new Promise((resolve, reject) => {
    API.post(`funnel/node/createUrl`, {
      'url': url,
      'funnelId': funnelId,
      'elementId': nodeId,
    })
      .then(response => {
        // console.log('response', response)
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
  });
}

export const getConversationInfoWithPromisefication = (funnelId, nodeId) => dispatch => {
  // console.log('ffffffff')
  return new Promise((resolve, reject) => {
    API.post(`funnel/node/getCounter`, {
      'funnelId': funnelId,
      'nodeId': nodeId,
    })
      .then(response => {
        // console.log('project.js response', response)
        if (response.status === 200) {
          // console.log(response.data)
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
  });
}

export const resetLink = () => dispatch => {
  dispatch({ type: 'CREATE_LINK_RESET' });
}

export function createTemplate(funnelId, templateName) {
  // console.log(funnelId, templateName)
  return function (dispatch) {
    API.post(`template/${funnelId}`, {
      'templateName': templateName
    })
      .then(response => {
        // console.log('createTemplate: ', response.data)
        dispatch({
          type: 'CREATE_TEMPLATE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CREATE_TEMPLATE_RESET' });
        }, 2000)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_TEMPLATE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getConversionInfoForAllNodes(funnelId) {
  // console.log(funnelId, templateName)
  return function (dispatch) {
    API.get(`funnel/node/static/getCounter/${funnelId}`)
      .then(response => {
        // console.log('getConversionInfoForAllNodes: ', response.data)
        dispatch({
          type: 'CONVERSION_INFO',
          payload: response.data.response
        });

        // setTimeout(() => {
        //   dispatch({ type: 'CREATE_TEMPLATE_RESET' });
        // }, 2000)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_TEMPLATE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getConversionInfoForAllNodesForRecipiensCollaborator(funnelId ,token) {
  const axiosConfig = {
    headers: {
      'authorization': token
    },
  };
  return function (dispatch) {
    axios.get(`${API_URL}/funnel/node/static/getCounter/${funnelId}`, axiosConfig)
      .then(response => {
        dispatch({
          type: 'CONVERSION_INFO',
          payload: response.data.response
        });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'CREATE_TEMPLATE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function saveDiagramThenCreateTemplate(funnelId, diagramObj, image, templateName) {
  const token = JSON.parse(localStorage.getItem('token'));
  let bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));

  return function (dispatch) {
    axios({
      method: 'patch',
      url: `${API_URL}/funnel/diagram/${funnelId}`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      },
      data: bodyFormData
    })
      .then(response => {
        // console.log('saveDiagramThenCreateTemplate response', JSON.parse(response.data.data.funnelBody))

        let res1 = JSON.parse(response.data.data.funnelBody);
        let res = {
          converted: res1.converted,
          snackMsg: 'next'
        }
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({
          type: 'SAVE_DIAGRAM_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
        }, 50)

        return API.post(`template/${funnelId}`, { 'templateName': templateName })
      })

      .then(response => {
        // console.log('createTemplate: ', response.data)
        dispatch({
          type: 'CREATE_TEMPLATE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CREATE_TEMPLATE_RESET' });
        }, 2000)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const saveDiagramThenExit = (funnelId, diagramObj, image) => dispatch => {
  const token = JSON.parse(localStorage.getItem('token'));
  let bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));
  axios({
    method: 'patch',
    url: `${API_URL}/funnel/diagram/${funnelId}`,
    headers: {
      'authorization': token,
      'Content-Type': 'form-data'
    },
    data: bodyFormData
  })
    .then(response => {
      // console.log('saveDiagramThenExit response', JSON.parse(response.data.data.funnelBody))

      let res1 = JSON.parse(response.data.data.funnelBody);
      let res = {
        converted: res1.converted,
        snackMsg: 'next'
      }
      dispatch({
        type: 'GET_DIAGRAM',
        payload: {
          funnelId,
          res,
        }
      });
      dispatch({
        type: 'SAVE_DIAGRAM_SUCCESS',
        payload: response.data.message
      });
      setTimeout(() => {
        dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
      }, 50)
      setTimeout(() => {
        dispatch(push('/projects'));
      }, 1000)

    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response)
        dispatch({
          type: 'CREATE_DIAGRAM_FAILURE',
          payload: error.response.data.error
        });
      }
    });
}



export function saveDiagram(funnelId, diagramObj, image) {
  const token = JSON.parse(localStorage.getItem('token'));
  let bodyFormData = new FormData();
  bodyFormData.append('funnelBackground', image);
  bodyFormData.append('funnelBody', JSON.stringify(diagramObj));
  return function (dispatch) {
    axios({
      method: 'patch',
      url: `${API_URL}/funnel/diagram/${funnelId}`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      },
      data: bodyFormData
    })
      .then(response => {
        // console.log('saveDiagram response', JSON.parse(response.data.data.funnelBody))
        let res1 = JSON.parse(response.data.data.funnelBody);
        let res = {
          converted: res1.converted,
          snackMsg: 'next'
        }
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({
          type: 'SAVE_DIAGRAM_SUCCESS',
          payload: response.data.message
        });
        setTimeout(() => {
          dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
        }, 50)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function saveTemplate(funnelId, diagramObj) {
  return function (dispatch) {
    API.patch(`template/update/${funnelId}`, {
      'templateBody': JSON.stringify(diagramObj)
    })
      .then(response => {
        // console.log('saveTemplate response: ', JSON.parse(response.data.data.funnelBody))
        /************************************/

        let res1 = JSON.parse(response.data.data.templateBody);
        let res = {
          converted: res1.converted,
          snackMsg: 'next'
        }

        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        /************************************/
        dispatch({
          type: 'SAVE_DIAGRAM_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
        }, 50)

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CREATE_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const resetMessageUpdateDiagram = () => dispatch => {
  dispatch({ type: 'SAVE_DIAGRAM_SUCCESS_RESET' });
}

export function createNewProjectWithTemplate(templateId, projectName, funnelId) {
  return function (dispatch) {
    API.post(`funnel/template/${templateId}`, {
      'projectName': projectName
    })
      .then(response => {
        dispatch({
          type: 'CREATE_NEW_PROJECT_WITH_TEMPLATE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CREATE_NEW_PROJECT_WITH_TEMPLATE_RESET' });
        }, 2000)

        setTimeout(() => {
          dispatch(push('/projects'));
        }, 1000)

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'SAVE_TEMPLATE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function getDiagram(funnelId) {
  return function (dispatch) {
    API.get(`funnel/diagram/${funnelId}`)
      .then(response => {
        let res = {}
        if (response.data.data.funnelBody) {
          res = JSON.parse(response.data.data.funnelBody);
          res['funnelName'] = response.data.data.funnelName;
        }
        else {
          res = {
            funnelName: response.data.data.funnelName,
            snackMsg: 'next'
          };
        }
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({ type: 'GET_DIAGRAM_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GET_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}


export function getDiagramForRecipiensCollaborator(funnelId, tokenCollaborator) {

  const axiosConfig = {
    headers: {
      // 'collaborate-confirm': tokenCollaborator,
      'authorization': tokenCollaborator
    },
  };

  return function (dispatch) {
    API.get(`funnel/diagram/${funnelId}`, axiosConfig)
    // axios.post(`${API_URL}/collaborator`, postData, axiosConfig)

   

      .then(response => {

        let res = {}
        if (response.data.data.funnelBody) {
          res = JSON.parse(response.data.data.funnelBody);
          res['funnelName'] = response.data.data.funnelName;
        }
        else {
          res = {
            funnelName: response.data.data.funnelName,
            snackMsg: 'next'
          };
        }
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({ type: 'GET_DIAGRAM_SUCCESS' });


      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GET_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });


  }
}



export function getTemplate(funnelId) {
  // console.log('getDiagram funnelId: ', funnelId)
  return function (dispatch) {
    API.get(`template/${funnelId}`)
      .then(response => {
        // console.log('getTemplate response: ', JSON.parse(response.data.data.funnelBody))

        let res = {}

        if (response.data.data.templateBody) {
          res = JSON.parse(response.data.data.templateBody);
          res['funnelName'] = response.data.data.templateName;
        }
        else {
          res = {
            funnelName: response.data.data.templateName,
            snackMsg: 'next'
          };
        }

        // console.log(res)
        dispatch({
          type: 'GET_DIAGRAM',
          payload: {
            funnelId,
            res,
          }
        });
        dispatch({ type: 'GET_DIAGRAM_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'GET_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function changePermission(funnelId, profileId, permissions) {
  // console.log('changePermission action: ', funnelId, profileId, permissions)
  return function (dispatch) {
    API.patch(`/collaborator/${profileId}/${funnelId}`, {
      'permissions': permissions
    })
      .then(response => {
        // console.log('changePermission response: ', response.data.message)
        dispatch({
          type: 'COLLABORATORS_MODAL_MESSAGE_SUCCESS',
          payload: response.data.message
        });

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'COLLABORATORS_MODAL_MESSAGE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function changeFunnelName(funnelId, funnelName) {
  // console.log('changeFunnelName action: ', funnelId, funnelName)
  return function (dispatch) {
    API.patch(`funnel/${funnelId}`, {
      'funnelName': funnelName
    })
      .then(response => {
        // console.log('changeFunnelName response: ', response.data)

        dispatch({
          type: 'CHANGE_FUNNEL_NAME_MESSAGE_SUCCESS',
          payload: response.data.message
        });

        setTimeout(() => {
          dispatch({ type: 'CHANGE_FUNNEL_NAME_MESSAGE_RESET' });
        }, 1000)

      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'CHANGE_FUNNEL_NAME_MESSAGE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export function resetCollaboratorsModalMessage() {
  return function (dispatch) {
    dispatch({ type: 'COLLABORATORS_MODAL_MESSAGE_RESET' });
  }
}

export function removeCollaborator(funnelId, profileId) {
  return function (dispatch) {
    API.delete(`/collaborator/${profileId}/${funnelId}`, {
      // 'funnelId': funnelId,
      // 'profileId': profileId,
    })
      .then(response => {
        // console.log('removeCollaborator response: ', response.data)
        dispatch({
          type: 'COLLABORATORS_MODAL_MESSAGE_SUCCESS',
          payload: response.data.message
        });
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'COLLABORATORS_MODAL_MESSAGE_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}








// export function sendImageToCollaborate(funnelId, info) {
//   return function (dispatch) {
//     API.post(`/funnel/diagram/screenshot`, {
//       'info': {
//         logo: info.imageBase64,
//         title: info.tittle,
//         text: info.text,
//         buttonText: info.buttonText,
//         buttonLink: info.buttonLink,
//       },
//       'funnelId': funnelId
//     })
//       .then(response => {
//         dispatch({
//           type: 'SEND_IMAGE_TO_COLLABORATE_LINK',
//           payload: response.data.link
//         });
//       })
//       .catch(function (error) {
//         if (error.response) {
//           console.log(error.response)
//           dispatch({
//             type: 'SEND_IMAGE_TO_COLLABORATE_LINK_FAILURE',
//             payload: error.response.data.error
//           });
//         }
//       });
//   }
// }

export function sendImageToCollaborate(funnelId, info) {
  const token = JSON.parse(localStorage.getItem('token'));
  let bodyFormData = new FormData();

  bodyFormData.append('logo', info.file);
  bodyFormData.append('title', info.tittle);
  bodyFormData.append('text', info.text);
  bodyFormData.append('buttonText', info.buttonText);
  bodyFormData.append('buttonLink', info.buttonLink);


  bodyFormData.append('funnelsId', funnelId);
  bodyFormData.append('permissions', 'View Only');
  return function (dispatch) {
    axios({
      method: 'post',
      url: `${API_URL}/funnel/diagram/screenshot`,
      headers: {
        'authorization': token,
        'Content-Type': 'form-data'
      },
      data: bodyFormData
    })
      .then(response => {
        if (response.data) {
          dispatch({
            type: 'SEND_IMAGE_TO_COLLABORATE_LINK',
            payload: response.data.link
          });
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
          dispatch({
            type: 'SEND_IMAGE_TO_COLLABORATE_LINK_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}

export const resetSendImageToCollaborateLink = () => dispatch => {
  dispatch({ type: 'SEND_IMAGE_TO_COLLABORATE_LINK_RESET' });
}

export const getSVG = () => dispatch => {
  API.get(`funnel/svg`)
    .then(response => {
      dispatch({
        type: 'GET_ALL_SVG',
        payload: response.data.response,
      });
      dispatch({ type: 'GET_ALL_SVG_SUCCESS' });
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response)
        dispatch({
          type: 'GET_DIAGRAM_FAILURE',
          payload: error.response.data.error
        });
      }
    });
}

export function getSVGForRecipiensCollaborator(token) {

  const axiosConfig = {
    headers: {
      'authorization': token
    },
  };
 
  return function (dispatch) {
    axios.get(`${API_URL}/funnel/svg`, axiosConfig)
      .then(response => {
        console.log('response', response.data)
        dispatch({
          type: 'GET_ALL_SVG',
          payload: response.data.response,
        });
        dispatch({ type: 'GET_ALL_SVG_SUCCESS' });
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({
            type: 'GET_DIAGRAM_FAILURE',
            payload: error.response.data.error
          });
        }
      });
  }
}


export const showSettingsModalOnlyBoolean = (boolean) => dispatch => {
  dispatch({
    type: 'CHANGE_SHOW_SETTINGS_MODAL',
    payload: {
      boolean
    }
  })
}

export const saveDiagramThenShowOrHideSettingsModal = (

  updateModel,
  
  model,
  node, 

  funnelId, 
  diagramObj, 
  boolean,
  
  
  typeOfNode,

) => dispatch => {


  setTimeout(() => {
    updateModel(
      diagramObj.converted,
      funnelId,
    )
  })

  dispatch({
    type: 'CHANGE_SHOW_SETTINGS_MODAL',
    payload: {
      boolean,
      typeOfNode,
      engine: model,
      model: node, 
    }
  })


}



export const saveDiagramThenShowOrHideNotesModal = (

  updateModel,
  
  model,
  node, 

  funnelId, 
  diagramObj, 
  boolean,
  

) => dispatch => {

  setTimeout(() => {
    updateModel(
      diagramObj.converted,
      funnelId,
    )
  })

      dispatch({
        type: 'CHANGE_SHOW_NOTES_MODAL',
        payload: {
          boolean,
          engine: model,
          model: node, 
        }
      })
}

export const showAnalyticsBoolean = boolean => dispatch => {
  dispatch({
    type: 'CHANGE_SHOW_ANALYTICS',
    payload: {
      boolean
    }
  })
}

export const showCommentsBoolean = boolean => dispatch => {
  dispatch({
    type: 'CHANGE_SHOW_COMMENTS',
    payload: {
      boolean
    }
  })
}

export const setPermission = object => dispatch => {
  dispatch({
    type: 'SET_PERMISSION',
    payload: object
  })
}

export const changeKeyDown = key => dispatch => {
  // console.log("KEY", key)
  dispatch({
    type: 'CHANGE_KEY_IS_DOWN',
    payload: {
      key
    }
  })
}