const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

// const headers = {
//     'Accept': 'application/json'
// };

export const uploadFile = (payload) =>
    fetch(`${api}/uploadFiles/uploadFile`, {
        method: 'POST',
        body: payload,
        credentials: 'same-origin'
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });