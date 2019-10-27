import authReducer from './authReducer';
import projectReducer from './projectReducer';
import collaborationsReducer from './collaborationsReducer';
import settingsReducer from './settingsReducer'
import commentsReducer from './commentsReducer';
import conversionReducer from './conversionReducer';
import usersReducer from './usersReducer'

const allReducers = ({
    auth: authReducer,
    projects: projectReducer,
    collaborations: collaborationsReducer,
    settings: settingsReducer,
    comments: commentsReducer,
    conversion: conversionReducer,
    users: usersReducer,
});

export default allReducers