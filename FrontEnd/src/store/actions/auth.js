import { API } from './instance'
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNIN_FAILURE,
  AUTH_USER,
  UN_AUTH_USER,
  // QUESTIONNAIRE_SUCCESS,
  // QUESTIONNAIRE_FAILURE,
  PASSWORD_FORGOT_SUCCESS,
  PASSWORD_FORGOT_FAILURE,
} from './types/index'

import { push } from 'connected-react-router'
import axios from 'axios'
import API_URL from '../../config'

/*
 * Error helper
 */
export function authError(CONST, error) {
  return {
    type: CONST,
    payload: error,
  };
}

export function emailValidError(emailValidationInfo) {
  return {
    type: 'EMAIL_VALID',
    payload: emailValidationInfo,
  };
}

/*
 * Sign up
 */
export function signupUser(props) {
  // const { firstName, accountName, email, password } = props;
  const limitedFalse = false

  return function (dispatch, getState) {
    let routerState = getState().router

    localStorage.setItem('signUpData', JSON.stringify(props, limitedFalse));
    localStorage.setItem('limited', JSON.stringify(limitedFalse));

    // dispatch({
    //   type: 'SAVE_SIGN_UP_DATA',
    //   payload: {
    //     password,
    //     email,
    //     firstName,
    //     accountName,
    //     'limited': false,
    //   }
    // });

    // API.post(`sign-up`, {
    //   'password': password,
    //   'email': email,
    //   'firstName': firstName,
    //   'accountName': accountName,
    //   'limited': false
    // })
    //   .then(response => {
    //     // console.log(response.data)

    //     if (response.data) {
    //       localStorage.setItem('token', JSON.stringify(response.data.token));
    //       localStorage.setItem('userFirstName', response.data.data.firstName);
    //       localStorage.setItem('userAvatar', JSON.stringify(API_URL + response.data.data.photoUrl));
    //     }

    //     dispatch({ type: SIGNUP_SUCCESS });
    //     dispatch({ type: AUTH_USER });

        let params = new URLSearchParams(routerState.location.search);
        if (params.get('add-collaborations')) {
          dispatch(push(`/questionnaire?add-collaborations=${params.get('add-collaborations')}`));
        }
        else if (params.get('add-partner')) {
          dispatch(push(`/questionnaire?add-partner=${params.get('add-partner')}`));
        }
        else {
          dispatch(push('/questionnaire'));
        }

      // })
      // .catch(function (error) {
      //   if (error.response) {
      //     dispatch(authError(SIGNUP_FAILURE, error.response.data.err.message))
      //   }
      // });
  }
}


export function signupTester(props) {
  // console.log('signupTester')
  // const { firstName, accountName, email, password } = props;
  const limitedTrue = true

  return function (dispatch, getState) {
    let routerState = getState().router

    localStorage.setItem('signUpData', JSON.stringify(props));
    localStorage.setItem('limited', JSON.stringify(limitedTrue));
     


    // API.post(`sign-up`, {
    //   'password': password,
    //   'email': email,
    //   'firstName': firstName,
    //   'accountName': accountName,
    //   'limited': true
    // })
    //   .then(response => {
    //     // console.log(response.data)

    //     if (response.data) {
    //       localStorage.setItem('token', JSON.stringify(response.data.token));
    //       localStorage.setItem('userAvatar', JSON.stringify(API_URL + response.data.data.photoUrl));
    //       localStorage.setItem('userFirstName', response.data.data.firstName);
    //     }

    //     dispatch({ type: SIGNUP_SUCCESS });
    //     dispatch({ type: AUTH_USER });

        let params = new URLSearchParams(routerState.location.search);
        if (params.get('add-collaborations')) {
          dispatch(push(`/questionnaire?add-collaborations=${params.get('add-collaborations')}`));
        }
        else if (params.get('add-partner')) {
          dispatch(push(`/questionnaire?add-partner=${params.get('add-partner')}`));
        }
        else {
          dispatch(push('/questionnaire'));
        }

      // })
      // .catch(function (error) {
      //   if (error.response) {
      //     dispatch(authError(SIGNUP_FAILURE, error.response.data.err.message))
      //   }
      // });
  }
}


/*
 * Sign in
 */
export function signinUser(props) {
  const { email, password } = props;

  return function (dispatch, getState) {
    let routerState = getState().router

    API.post(`sign-in`, {
      'email': email.trim(),
      'password': password
    })
      .then(response => {
        if (response.data) {
          // console.log(response.data)
          localStorage.setItem('token', JSON.stringify(response.data.token));
          localStorage.setItem('userAvatar', JSON.stringify(API_URL + response.data.data.photoUrl));
          localStorage.setItem('userFirstName', response.data.data.firstName);
          localStorage.setItem('userID', response.data.data._id);

          dispatch({ type: AUTH_USER });

          let params = new URLSearchParams(routerState.location.search);
          if (params.get('add-collaborations')) {
            dispatch(push(params.get('add-collaborations')));
          }
          else if (params.get('add-partner')) {
            dispatch(push(params.get('add-partner')));
          }
          else {
            dispatch(push('/projects'));
          }

        }
      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(SIGNIN_FAILURE, error.response.data.message))
        }
      });
  }
}

export function validationUser(email) {
  return function (dispatch) {
    API.post(`email-validation`, {
      'email': email,
    })
      .then(res => res.json())
      .catch(function (error) {
        if (error.response) {
          dispatch(emailValidError(error.response.data.message))
        }
      });
  }
}

/*
 * Questionnaire
 */
export function questionnaireUser(props, signUpData, limited) {
  const {
    radioGroup,
    // Name,
    // Website,
  } = props;

  let obj = {};

  if (radioGroup === `Company`) {
    obj = {
      'description': radioGroup
    }
  }

  if (radioGroup === `Agency`) {
    obj = {
      'description': radioGroup
    }
  }

  if (radioGroup === `Freelancer`) {
    obj = {
      'description': radioGroup
    }
  }

  if (radioGroup === `Other`) {
    obj = {
      'description': radioGroup
    }
  }

    if (radioGroup === null) {
    obj = {
      'description': null  
    }
  }

  return function (dispatch, getState) {
    let routerState = getState().router

    API.post(`sign-up`, {
      'password': signUpData.password,
      'email': signUpData.email.toLowerCase(),
      'firstName': signUpData.firstName,
      'accountName': signUpData.accountName,
      'limited': limited,
      'description': obj
    })
      .then(response => {

        if (response.data) {
          localStorage.setItem('token', JSON.stringify(response.data.token));
          localStorage.setItem('userFirstName', response.data.data.firstName);
          localStorage.setItem('userAvatar', JSON.stringify(API_URL + response.data.data.photoUrl));
          localStorage.setItem('userID', response.data.data._id);
        }

        dispatch({ type: SIGNUP_SUCCESS });
        dispatch({ type: AUTH_USER });

        let params = new URLSearchParams(routerState.location.search);
        if (params.get('add-collaborations')) {
          let route = params.get('add-collaborations');
          dispatch(push(route));
        }
        else if (params.get('add-partner')) {
          let route = params.get('add-partner');
          dispatch(push(route));
        }
        else {
          dispatch(push('/projects'));
        }

        localStorage.removeItem('signUpData');
        localStorage.removeItem('limited');
      })

      .catch(function (error) {
        if (error.response) {
          dispatch(authError(SIGNUP_FAILURE, error.response.data.err.message))
        }
      });
  }
}

/*
 * password forgot
 */
export function passwordForgotUserStep1(data) {
  const {
    email,
  } = data;

  return function (dispatch) {
    API.post(`reset-password`, {
      'email': email,
    })
      .then(() => {
        dispatch(push('/password-forgot-step-2'));
      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(PASSWORD_FORGOT_FAILURE, error.response.data.err.message))
        }
      });
  }
}


export function passwordForgotUserStep3(data, token) {
  const {
    password,
  } = data;

  const postData = {
    'password': password
  };

  const axiosConfig = {
    headers: {
      'letter-confirm': token
    }
  };

  return function (dispatch) {
    axios.post(`${API_URL}/change-password`, postData, axiosConfig)
      .then(() => {
        dispatch({ type: PASSWORD_FORGOT_SUCCESS });
        dispatch(push('/sign-in'));
      })
      .catch(function (error) {
        if (error.response) {
          dispatch(authError(PASSWORD_FORGOT_FAILURE, error.response.data.err.message))
        }
      });
  }
}

export const signOutUser = () => dispatch => {
  localStorage.clear();
  dispatch({ type: UN_AUTH_USER });
}
