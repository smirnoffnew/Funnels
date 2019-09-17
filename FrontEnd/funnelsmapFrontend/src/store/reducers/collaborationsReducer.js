import {

} from '../actions/types/index';


const initialState = {
}

export default function (state = initialState, action) {
  // console.log(action.payload)
  switch (action.type) {
    ///////////////////////////////////////////////////////////////////////////
    case 'ADD_COLLABORATOR_RESET':
      return { ...state, addCollaborator: [] };
    case 'ADD_COLLABORATOR':
      return { ...state, addCollaborator: action.payload };
    case 'ADD_COLLABORATOR_SUCCESS':
      return { ...state, addCollaboratorError: '' };
    case 'ADD_COLLABORATOR_FAILURE':
      return { ...state, addCollaboratorError: action.payload };
    ///////////////////////////////////////////////////////////////////////////
    case 'GET_ALL_FUNNELS_COLLABORATION':
      return { ...state, funnelsCollaborationsList: action.payload };
    case 'GET_ALL_FUNNELS_COLLABORATION_SUCCESS':
      return { ...state, funnelsCollaborationsListError: '' };
    case 'GET_ALL_FUNNELS_COLLABORATION_FAILURE':
      return { ...state, funnelsCollaborationsListError: action.payload };
    ///////////////////////////////////////////////////////////////////////////
    case 'GET_ALL_COLLABORATORS_FOR_FUNNELS_RESET':
      return { ...state, allCollaboratorsForFunnels: {} };
    case 'GET_ALL_COLLABORATORS_FOR_FUNNELS':
      return { ...state, allCollaboratorsForFunnels: action.payload };
    case 'GET_ALL_COLLABORATORS_FOR_FUNNELS_SUCCESS':
      return { ...state, allCollaboratorsForFunnelsError: '' };
    case 'GET_ALL_COLLABORATORS_FOR_FUNNELS_FAILURE':
      return { ...state, allCollaboratorsForFunnelsError: action.payload };
    ///////////////////////////////////////////////////////////////////////////

    default: return state;
  }
}