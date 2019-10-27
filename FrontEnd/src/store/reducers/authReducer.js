import {
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNIN_FAILURE,
  AUTH_USER,
  UN_AUTH_USER,
  EMAIL_VALID,
  AUTH_RESET,
  AUTH_RESET_SUCCESS,
  AUTH_RESET_FAILURE,
  QUESTIONNAIRE_SUCCESS,
  QUESTIONNAIRE_FAILURE,
  PASSWORD_FORGOT_SUCCESS,
  PASSWORD_FORGOT_FAILURE,

} from '../actions/types/index';

export default function (state = {}, action) {
  switch (action.type) {
    case SIGNUP_SUCCESS:
      return { ...state, signup: true, SignUpError: '' };
    case SIGNUP_FAILURE:
      return { ...state, signup: false, SignUpError: action.payload };
    case SIGNIN_FAILURE:
      return { ...state, SignInError: action.payload };

    case "SIGN_IN_ERROR_RESET":
      return { ...state, SignInError: '' }

    ////////////////////////////////////////////////////////////////////////////////
    case QUESTIONNAIRE_SUCCESS:
      return { ...state, questionnaireError: '' };
    case QUESTIONNAIRE_FAILURE:
      return { ...state, questionnaireError: action.payload };
       ////////////////////////////////////////////////////////////////////////////////
    case PASSWORD_FORGOT_SUCCESS:
      return { ...state, passwordForgotError: '' };
    case PASSWORD_FORGOT_FAILURE:
      return { ...state, passwordForgotError: action.payload };
    ////////////////////////////////////////////////////////////////////////////////
    case AUTH_USER:
      return { ...state, authenticated: true, SignUpError: '', SignInError: '' };
    case UN_AUTH_USER:
      return { ...state, authenticated: false, SignUpError: '', SignInError: '' };

    case EMAIL_VALID:
      return { ...state, emailValidationInfo: action.payload }
    ////////////////////////////////////////////////////////////////////////////////
    case AUTH_RESET:
      return { ...state, authenticatedReset: true, SignUpError: '', SignInError: '' }
    case AUTH_RESET_SUCCESS:
      return { ...state, authenticatedReset: false, SignUpError: '', SignInError: '' }
    case AUTH_RESET_FAILURE:
      return { ...state, authenticatedReset: false, error: action.payload }
    default: return state;
  }
}