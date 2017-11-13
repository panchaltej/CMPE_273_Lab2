import {LOAD_FILES} from '../actions/index';
import {HANDLE_STAR} from '../actions/index';
import {UPDATE_PARENT} from '../actions/index';
import{LOAD_FOLDER} from '../actions/index';
import{INITIALIZE_STATE} from '../actions/index';

const initialState = { 
    files:[],
    parentId:''
};


const directory = (state = initialState, action) => { 
    switch (action.type) {

        case INITIALIZE_STATE :
        state = {
            files: [],
            parentId: ''
        };
        console.log(state);
        return state;

        case LOAD_FILES :
        state = {
            // files: action.obj.result,
            files: action.obj,
            parentId: state.parentId
        };
        console.log(state);
        return state;

        case HANDLE_STAR :
        state.files= state.files.map((fileitem) => {
            if (fileitem._id == action.obj._id) {
                if(fileitem.IsStarred == 0){
                    return Object.assign({}, fileitem, {
                        IsStarred : 1
                    })
                }
                else{
                    return Object.assign({}, fileitem, {
                        IsStarred : 0
                    })
                }
              }
              return fileitem;
        });
        state = {
            files: state.files,
            parentId: state.parentId
        };
        return state;

        case UPDATE_PARENT :
        state = {
            files: state.files,
            // parentId: action.obj.Id
            parentId: action.obj._id
        };
        return state;

        case LOAD_FOLDER :
        state = {
            // files: action.obj.result,
            files: action.obj,
            parentId: state.parentId
        };
        console.log(state);
        return state;

        default :
            return state;

    }
};
    
export default directory;