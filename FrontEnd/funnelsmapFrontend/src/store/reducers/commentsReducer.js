import {
    SEND_MESSAGE_SUCCESS,
     GET_ALL_COMMENTS_SUCCESS
  } from '../actions/types/index';

const initialState = {
    comments:[],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SEND_MESSAGE_SUCCESS:
      return { ...state, comments:[...state.comments, action.payload] };
  case GET_ALL_COMMENTS_SUCCESS:
      return {...state, comments:[...action.payload]}
    default: return state;
  }
}