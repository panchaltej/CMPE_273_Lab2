import {LOAD_SHARED} from '../actions/index';
import{INITIALIZE_SHARED} from '../actions/index';
import{UPDATE_SHARED} from '../actions/index';

const initialState = { 
    sharedfiles:[],
    fileshared:null
};


const shared = (state = initialState, action) => { 
    switch (action.type) {

        case INITIALIZE_SHARED :
        state = {
            sharedfiles: [],
            fileshared: null
        };
        console.log(state);
        return state;

        case LOAD_SHARED :
        state = {
            // sharedfiles: action.obj.result,
            sharedfiles: action.obj,
            fileshared: state.fileshared
        };
        console.log(state);
        return state;

        case UPDATE_SHARED :
        state = {
            sharedfiles: state.sharedfiles,
            fileshared: action.obj
        };
        return state;


        default :
            return state;

    }
};
    
export default shared;