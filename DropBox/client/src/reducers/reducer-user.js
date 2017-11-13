import {LOAD_USER} from '../actions/index';
import {SAVE_USER} from '../actions/index';
//import {REMOVE_ITEM} from '../actions/index';

const initialState = {
        UserId: 11,
        FirstName: '',
        LastName: '',
        EmailId: '',
        Password: '',
        Work: '',
        Education: '',
        Contact: '',
        Interests: '',
        isLoggedIn: false
};


const user = (state = initialState, action) => { 
    switch (action.type) {
        case LOAD_USER :
            //return Object.assign({}, state, 
                state = {
                UserId: action.obj.UserId,
                FirstName: action.obj.FirstName,
                LastName: action.obj.LastName,
                EmailId: action.obj.EmailId,
                Password: action.obj.Password,
                Work: action.obj.Work,
                Education: action.obj.Education,
                Contact: action.obj.Contact,
                Interests: action.obj.Interests,
                isLoggedIn: true
            };
            console.log(state);
            return state;

            case SAVE_USER :
            //return Object.assign({}, state, 
                state = {
                UserId: state.UserId,
                FirstName: action.obj.FirstName,
                LastName: action.obj.LastName,
                EmailId: action.obj.EmailId,
                Password: state.Password,
                Work: action.obj.Work,
                Education: action.obj.Education,
                Contact: action.obj.Contact,
                Interests: action.obj.Interests,
                isLoggedIn: true
            };
            console.log(state);
            return state;
            
        default :
        return state;

        // case REMOVE_ITEM :
        // return state.map((item) => {
        //     if (item.id == action.clickedItem.id) {
        //         if(action.clickedItem.Qty > 1){
        //             return Object.assign({}, item, {
        //                 totalcost:action.clickedItem.totalcost - action.clickedItem.cost,
        //                 ordered: "true",
        //                 Qty: action.clickedItem.Qty -1
        //             })
        //         }
        //         else{
        //             return Object.assign({}, item, {
        //                 totalcost:action.clickedItem.cost,
        //                 ordered: "false",
        //                 Qty: 0
        //             })
        //         }
        //     }
        //     return item
        // });

        

    }
};
    
export default user;

// export default function() {
//     return {
//         userdata: {
//             UserId: 0,
//             FirstName: '',
//             LastName: '',
//             EmailId: 'tejas@gmail.com',
//             Password: 'tejas',
//             Work: '',
//             Education: '',
//             Contact: '',
//             Interests: ''
    
//         },
//         isLoggedIn: false
//     };
// }