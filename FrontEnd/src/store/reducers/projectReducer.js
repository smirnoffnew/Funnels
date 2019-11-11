import {
  GET_ALL_PROJECTS,
  CREATE_PROJECT,
  DELETE_PROJECT,
  CREATE_PROJECT_FAILURE,
  DELETE_PROJECT_FAILURE,
  GET_ALL_PROJECTS_FAILURE,
  DELETE_PROJECT_SUCCESS,
  GET_ALL_PROJECTS_SUCCESS,
} from '../actions/types/index';


const initialState = {
  showSettingsWidgetBoolean: false,
  showAnalyticsBoolean: false,
  createProjectError: '',
  permissionForCollaborator: "Edit,Create",
  keyDown: "",
}

export default function (state = initialState, action) {
  // console.log(state.permissionForCollaborator)
  switch (action.type) {
    ///////////////////////////////////////////////////////////////////////////
    case 'RESET_ALL_PROJECTS':
      return { ...state, projectsList: [] };
    case GET_ALL_PROJECTS:
      return { ...state, projectsList: action.payload };
    case GET_ALL_PROJECTS_SUCCESS:
      return { ...state, getAllProjectsError: '' };
    case GET_ALL_PROJECTS_FAILURE:
      return { ...state, getAllProjectsError: action.payload };
    ///////////////////////////////////////////////////////////////////////////   


    ///////////////////////////////////////////////////////////////////////////
    case 'GET_ALL_PROJECTS_LIMIT':
      return { ...state, projectsListLimit: action.payload };
    /////////////////////////////////////////////////////////////////////////// 



    ///////////////////////////////////////////////////////////////////////////
    case 'RESET_ALL_TEMPLATES':
      return { ...state, templatesList: [] };
    case 'GET_ALL_TEMPLATES':
      return { ...state, templatesList: action.payload };
    case 'GET_ALL_TEMPLATES_SUCCESS':
      return { ...state, getAllTemplatesError: '' };
    case 'GET_ALL_TEMPLATES_FAILURE':
      return { ...state, getAllTemplatesError: action.payload };
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    case CREATE_PROJECT:
      return {
        ...state,
        projectsList: [...state.projectsList,
        action.payload
        ]
      };
    case 'CLEAR_CREATE_PROJECT_ERROR':
      return { ...state, createProjectError: '' };
    case CREATE_PROJECT_FAILURE:
      return { ...state, createProjectError: action.payload };
    ///////////////////////////////////////////////////////////////////////////
    case DELETE_PROJECT:
      const list = state.projectsList.filter(project => project._id !== action.payload);
      return {
        ...state,
        projectsList: list,
      };
    case DELETE_PROJECT_SUCCESS:
      return { ...state, deleteProjectError: '' };
    case DELETE_PROJECT_FAILURE:
      return { ...state, deleteProjectError: action.payload };
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    case 'DELETE_TEMPLATE':
      const ttemplatesList = state.templatesList.filter(template => template._id !== action.payload);
      return {
        ...state,
        templatesList: ttemplatesList,
      };
    case 'DELETE_TEMPLATE_SUCCESS':
      return { ...state, deleteTemplateError: '' };
    case 'DELETE_TEMPLATE_FAILURE':
      return { ...state, deleteTemplateError: action.payload };
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    case 'RESET_ALL_FUNNELS':
      return { ...state, [`funnelsList${action.payload.projectId}`]: [] };
    case 'GET_ALL_FUNNELS':
      return { ...state, [`funnelsList${action.payload.projectId}`]: action.payload.res };
    case 'GET_ALL_FUNNELS_LIMIT':
      return { ...state, [`funnelsListLimit${action.payload.projectId}`]: action.payload.limit };
    ///////////////////////////////////////////////////////////////////////////
    case 'DELETE_FUNNEL':
      const funnelsList = state[`funnelsList${action.payload.project_id}`].filter(funnel => funnel._id !== action.payload.funnel_id);
      return {
        ...state,
        [`funnelsList${action.payload.project_id}`]: funnelsList,
      };
    ///////////////////////////////////////////////////////////////////////////
    case 'CREATE_FUNNEL':
      return {
        ...state,
        [`funnelsList${action.payload.projectId}`]: [...state[`funnelsList${action.payload.projectId}`],
        action.payload.res
        ]
      };
    case 'CLEAR_CREATE_FUNNEL_ERROR':
      return { ...state, createFunnelError: '' };
    case 'CREATE_FUNNEL_FAILURE':
      return { ...state, createFunnelError: action.payload };
    ///////////////////////////////////////////////////////////////////////////
    case 'CREATE_LINK':
      return { ...state, createLink: action.payload };
    case 'CREATE_LINK_RESET':
      return { ...state, createLink: '' };
    case 'CREATE_LINK_SUCCESS':
      return { ...state, createLinkError: '' };
    case 'CREATE_LINK_FAILURE':
      return { ...state, createLinkError: action.payload, createLink: '' };
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    case 'CREATE_UTM_LINK_MESSAGE':
      return { ...state, createUTMLinkMessage: action.payload };
    case 'CREATE_UTM_LINK_MESSAGE_RESET':
      return { ...state, createUTMLinkMessage: null };
    ///////////////////////////////////////////////////////////////////////////





    ///////////////////////////////////////////////////////////////////////////
    case 'CREATE_NEW_PROJECT_WITH_TEMPLATE_RESET':
      return { ...state, createNewProjectWithTemplateMessage: null }
    case 'CREATE_NEW_PROJECT_WITH_TEMPLATE_SUCCESS':
      return { ...state, createNewProjectWithTemplateMessage: action.payload };
    case 'CREATE_NEW_PROJECT_WITH_TEMPLATE_FAILURE':
      return { ...state, createNewProjectWithTemplateMessage: action.payload };
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    case 'SEND_IMAGE_TO_COLLABORATE_LINK':
      return { ...state, sendImageToCollaborateLink: action.payload }
    case 'SEND_IMAGE_TO_COLLABORATE_LINK_RESET':
      return { ...state, sendImageToCollaborateLink: null }
    case 'SEND_IMAGE_TO_COLLABORATE_LINK_SUCCESS':
      return { ...state, sendImageToCollaborateMessage: action.payload };
    case 'SEND_IMAGE_TO_COLLABORATE_LINK_FAILURE':
      return { ...state, sendImageToCollaborateMessage: action.payload, sendImageToCollaborateLink: null };
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    case 'SAVE_DIAGRAM_SUCCESS_RESET':
      return { ...state, saveDiagramMessage: null }
    case 'SAVE_DIAGRAM_SUCCESS':
      return { ...state, saveDiagramMessage: action.payload };
    case 'SAVE_DIAGRAM_FAILURE':
      return { ...state, saveDiagramMessage: action.payload };
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    case 'CHANGE_FUNNEL_NAME_MESSAGE_SUCCESS':
      return { ...state, changeFunnelNameMessage: action.payload };
    case 'CHANGE_FUNNEL_NAME_MESSAGE_FAILURE':
      return { ...state, changeFunnelNameMessage: action.payload };
    case 'CHANGE_FUNNEL_NAME_MESSAGE_RESET':
      return { ...state, changeFunnelNameMessage: null }
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    case 'CREATE_TEMPLATE_RESET':
      return { ...state, createTemplateMessage: null }
    case 'CREATE_TEMPLATE_SUCCESS':
      return { ...state, createTemplateMessage: action.payload };
    case 'CREATE_TEMPLATE_FAILURE':
      return { ...state, createTemplateMessage: action.payload };
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    case 'SAVE_TEMPLATE_RESET':
      return { ...state, saveTemplateMessage: null }
    case 'SAVE_TEMPLATE_SUCCESS':
      return { ...state, saveTemplateMessage: action.payload };
    case 'SAVE_TEMPLATE_FAILURE':
      return { ...state, saveTemplateMessage: action.payload };
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    case 'GET_DIAGRAM': {
      return { ...state, [`diagram${action.payload.funnelId}`]: action.payload.res };
    }

    case 'GET_DIAGRAM_SUCCESS':
      return { ...state, getDiagramError: '' };
    case 'GET_DIAGRAM_FAILURE':
      return { ...state, getDiagramError: action.payload };
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    case 'COLLABORATORS_MODAL_MESSAGE_SUCCESS':
      return { ...state, collaboratorsModalMessage: action.payload }
    case 'COLLABORATORS_MODAL_MESSAGE_FAILURE':
      return { ...state, collaboratorsModalMessage: action.payload }
    case 'COLLABORATORS_MODAL_MESSAGE_RESET':
      return { ...state, collaboratorsModalMessage: '' }
    ///////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////
    case 'RESET_ALL_SVG':
      return { ...state, svgList: [] };
    case 'GET_ALL_SVG':
      return { ...state, svgList: action.payload };
    case 'GET_ALL_SVG_SUCCESS':
      return { ...state, getAllSvgMessage: '' };
    case 'GET_ALL_SVG_FAILURE':
      return { ...state, getAllSvgMessage: action.payload };
    /////////////////////////////////////////////////////////////////////////// 



    ///////////////////////////////////////////////////////////////////////////
    case 'CHANGE_SHOW_SETTINGS_MODAL':
      return {
        ...state,
        showSettingsWidgetBoolean: action.payload.boolean,
        showSettingsWidgetModel: action.payload.model,
        showSettingsWidgetEngine: action.payload.engine,
        showTypeOfNode: action.payload.typeOfNode,
      };
    /////////////////////////////////////////////////////////////////////////// 

    ///////////////////////////////////////////////////////////////////////////
    case 'CHANGE_SHOW_NOTES_MODAL':
      return {
        ...state,
        showNotesWidgetBoolean: action.payload.boolean,
        showNotesWidgetModel: action.payload.model,
        showNotesWidgetEngine: action.payload.engine,
      };
    /////////////////////////////////////////////////////////////////////////// 


    ///////////////////////////////////////////////////////////////////////////
    case 'CHANGE_SHOW_ANALYTICS':
      return {
        ...state,
        showAnalyticsBoolean: action.payload.boolean,
      };
    /////////////////////////////////////////////////////////////////////////// 


    ///////////////////////////////////////////////////////////////////////////
    case 'SET_PERMISSION':
      return {
        ...state,
        permissionForCollaborator: action.payload,
      };
    /////////////////////////////////////////////////////////////////////////// 

    ///////////////////////////////////////////////////////////////////////////
    case 'CONVERSION_INFO':
      return {
        ...state,
        conversionInfoForAllNodes: action.payload,
      };
    /////////////////////////////////////////////////////////////////////////// 
    case 'CHANGE_SHOW_COMMENTS':
      return {
        ...state, showCommentsWidgetBoolean: action.payload.boolean
      }
    case 'CHANGE_KEY_IS_DOWN':
      return {
        ...state, keyDown: action.payload.key
      }


    case 'UPDATE_MODEL':
      return {
        ...state,
        [`model${action.payload.funnelId}`]: action.payload.model
      };

    default: return state;
  }
}