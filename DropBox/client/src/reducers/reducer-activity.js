import {LOAD_ACTIVITY} from '../actions/index';

const initialState = {
        activities:[]
};


const activity = (state = initialState, action) => { 
    switch (action.type) {
        case LOAD_ACTIVITY :
            state = {
                // activities: action.obj.result
                activities: action.obj.result[0].Activity
            };
            console.log(state);
            return state;

        default :
            return state;
    }
};
    
export default activity;