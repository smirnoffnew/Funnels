import {
    GET_ALL_DEVELOPMENT_STAGES,
    CHANGE_STAUS_OF_NODE
} from '../actions/types/index';

const initialState = {
    stages: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_DEVELOPMENT_STAGES:{
            return { ...state,stages:[...state.stages, ...action.payload]  };
        }
        case CHANGE_STAUS_OF_NODE:{
                let newStages = state.stages.map( el => {
                        if(el.nodeId === action.payload.id) {
                            return {
                                ...el,
                                status: action.payload.status
                            }
                        }
                        return el
                })

                if(!newStages.find(el => el.nodeId === action.payload.id)){
                    let stagesWithElement = newStages.concat({
                        nodeId: action.payload.id,
                        status: action.payload.status
                    })  
                    return {...state, stages:[...stagesWithElement]}
                }else{
                    return {...state, stages:[...newStages]}
                }
                
            }
           
           
        // case SEND_MESSAGE_FAILURE:
        //   return { ...state, addCollaborator: action.payload };
        default:
            return { ...state }


    }
}