import { API } from './instance'
import {
    GET_ALL_DEVELOPMENT_STAGES,
    CHANGE_STAUS_OF_NODE
} from './types/index';


export function getAllDevelopmentStages(funnelId) {
    return function (dispatch) {
        API.get(`funnel/node/getallstatus/${funnelId}`)
            .then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: GET_ALL_DEVELOPMENT_STAGES,
                        payload: response.data.response
                    });
                }
            })
    }
}

export function changeStatusOfNode(funnelId, nodeId, status) {
    return function (dispatch) {
        API
            .patch(`funnel/node/status`, {
                funnelId: funnelId,
                nodeId: nodeId,
                status: status
            })
            .then(response => {
                dispatch({
                    type: CHANGE_STAUS_OF_NODE,
                    payload: {
                        id: nodeId,
                        status
                    }
                });

            })
            .catch(error => {
                console.log(error);
            });
    }
}