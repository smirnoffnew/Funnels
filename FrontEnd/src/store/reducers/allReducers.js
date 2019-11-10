import authReducer from './authReducer';
import projectReducer from './projectReducer';
import collaborationsReducer from './collaborationsReducer';
import settingsReducer from './settingsReducer'
import commentsReducer from './commentsReducer';
import conversionReducer from './conversionReducer';
import usersReducer from './usersReducer'
import undoable, { includeAction } from 'redux-undo';

const allReducers = ({
    auth: authReducer,
    projects: projectReducer,

    history: undoable(projectReducer, {
        limit: 3, // set a limit for the history
        filter: includeAction('UPDATE_MODEL'),
        // debug: true, 
    }),
    collaborations: collaborationsReducer,
    settings: settingsReducer,
    comments: commentsReducer,
    conversion: conversionReducer,
    users: usersReducer,
});

export default allReducers