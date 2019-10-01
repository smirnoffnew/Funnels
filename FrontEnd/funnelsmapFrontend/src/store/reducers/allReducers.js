import authReducer from './authReducer';
import projectReducer from './projectReducer';
import collaborationsReducer from './collaborationsReducer';
import settingsReducer from './settingsReducer'
import commentsReducer from './commentsReducer';

const allReducers = ({
    auth: authReducer,
    projects: projectReducer,
    collaborations: collaborationsReducer,
    settings: settingsReducer,
    comments: commentsReducer,
});

export default allReducers