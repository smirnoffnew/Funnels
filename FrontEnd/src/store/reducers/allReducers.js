import authReducer from './authReducer';
import projectReducer from './projectReducer';
import collaborationsReducer from './collaborationsReducer';
import settingsReducer from './settingsReducer'
import commentsReducer from './commentsReducer';
import conversionReducer from './conversionReducer';
import usersReducer from './usersReducer'
import undoable, { includeAction } from 'redux-undo';
import tosterReducer from './tosterReducer';

const allReducers = ({
    auth: authReducer,
    projects: projectReducer,

    history: undoable(projectReducer, {
        limit: 3, // set a limit for the history
        filter: includeAction('UPDATE_MODEL'),
        // initTypes: ['@@redux-undo/GET_DIAGRAM'],
        // debug: true, 
    }),
    collaborations: collaborationsReducer,
    settings: settingsReducer,
    comments: commentsReducer,
    conversion: conversionReducer,
    users: usersReducer,
    toster: tosterReducer,
});

export default allReducers