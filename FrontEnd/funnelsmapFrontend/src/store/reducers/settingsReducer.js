import {

} from '../actions/types/index';


const initialState = {

}

export default function (state = initialState, action) {
  switch (action.type) {
    ///////////////////////////////////////////////////////////////////////////
    case 'SETTINGS_MESSAGE_AVATAR_SUCCESS':
      return { ...state, settingsMessageAvatar: action.payload };
    case 'SETTINGS_MESSAGE_AVATAR_FAILURE':
      return { ...state, settingsMessageAvatar: action.payload };
    case 'SETTINGS_MESSAGE_AVATAR_RESET':
      return { ...state, settingsMessageAvatar: '' }
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    case 'SETTINGS_MESSAGE_PASSWORD_SUCCESS':
      return { ...state, settingsMessagePassword: action.payload };
    case 'SETTINGS_MESSAGE_PASSWORD_FAILURE':
      return { ...state, settingsMessagePassword: action.payload };
    case 'SETTINGS_MESSAGE_PASSWORD_RESET':
      return { ...state, settingsMessagePassword: '' }
    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    case 'SETTINGS_MESSAGE_NAME_SUCCESS':
      return { ...state, settingsMessageName: action.payload };
    case 'SETTINGS_MESSAGE_NAME_FAILURE':
      return { ...state, settingsMessageName: action.payload };
    case 'SETTINGS_MESSAGE_NAME_RESET':
      return { ...state, settingsMessageName: '' }
    ///////////////////////////////////////////////////////////////////////////

    default: return state;
  }
}