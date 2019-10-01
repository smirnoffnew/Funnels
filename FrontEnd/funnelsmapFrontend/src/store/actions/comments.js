import { API } from './instance'
import {
    SEND_MESSAGE_SUCCESS,
    GET_ALL_COMMENTS_SUCCESS,
} from './types/index';

export function sendComment(userId, funnelId, comment) {
    return function (dispatch) {
        API.post(`comment`, {
            'userId': userId,
            'funnelId': funnelId,
            "comment": comment.comment,
        })
            .then(response => {

                if (response.status === 200) {
                    dispatch({
                        type: SEND_MESSAGE_SUCCESS,
                        payload: comment
                    });
                }
            })
    }
}

export function getAllComment(funnelId) {
    return function (dispatch) {
        API.get(`comment/${funnelId}`)
            .then(response => {
                dispatch({
                    type: GET_ALL_COMMENTS_SUCCESS,
                    payload: response.data.commentsList
                });
            })
    }
}