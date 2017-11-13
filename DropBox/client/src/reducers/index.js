import {combineReducers} from 'redux';
import UserReducer from './reducer-user';
import FilesReducer from './reducer-directory';
import ActivityReducer from './reducer-activity';
import SharedReducer from './reducer-shared';


const allReducers = combineReducers({
    directory: FilesReducer,
    userdetail: UserReducer,
    activity: ActivityReducer,
    shared: SharedReducer
});

export default allReducers;