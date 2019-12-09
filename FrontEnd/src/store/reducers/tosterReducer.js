const initialState = {
    tosterList: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'CREATE_TOSTER':
            return {
                ...state,
                tosterList: [
                    ...state.tosterList,
                    {
                        data: action.payload.data,
                        id: action.payload.id,
                    }
                    
                ]
            };

        case 'DELETE_TOSTER':
            const tosterList = state.tosterList.filter(funnel => funnel.id !== action.payload.id);
            return {
                ...state,
                tosterList,
            };
        default: return state;
    }
}