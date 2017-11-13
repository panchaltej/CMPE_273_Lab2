export const LOAD_USER = 'LOAD_USER';
export const SAVE_USER = 'SAVE_USER';
export const LOAD_FILES = 'LOAD_FILES';
export const HANDLE_STAR = 'HANDLE_STAR';
export const UPDATE_PARENT = 'UPDATE_PARENT';
export const LOAD_FOLDER = 'LOAD_FOLDER';
export const INITIALIZE_STATE = 'INITIALIZE_STATE';
export const LOAD_ACTIVITY = 'LOAD_ACTIVITY';
export const LOAD_SHARED = 'LOAD_SHARED';
export const INITIALIZE_SHARED = 'INITIALIZE_SHARED';
export const UPDATE_SHARED = 'UPDATE_SHARED';


export function InitializeState(obj) {
    console.log("User Loaded");
    return {
        type : "INITIALIZE_STATE",
        obj                               // this is same as newItem : newItem in ES6
    }
}

export function LoadUser(obj) {
    console.log("User Loaded");
    return {
        type : "LOAD_USER",
        obj                               // this is same as newItem : newItem in ES6
    }
}

export function LoadFiles(obj) {
    console.log("Files loaded");
    return {
        type : "LOAD_FILES",
        obj                                // this is same as newItem : newItem in ES6
    }
}

export function HandleStar(obj) {
    console.log("Files loaded");
    return {
        type : "HANDLE_STAR",
        obj                                // this is same as newItem : newItem in ES6
    }
} 

export function UpdateParent(obj) {
    console.log("Parent updated");
    return {
        type : "UPDATE_PARENT",
        obj                                // this is same as newItem : newItem in ES6
    }
}

export function LoadFolder(obj) {
    console.log("Folder Loaded");
    return {
        type : "LOAD_FOLDER",
        obj                                // this is same as newItem : newItem in ES6
    }
}

export function SaveUserInfo(obj) {
    console.log("UserInfo saved");
    return {
        type : "SAVE_USER",
        obj                                // this is same as newItem : newItem in ES6
    }
}

export function LoadActivity(obj) {
    console.log("Activity Loaded");
    return {
        type : "LOAD_ACTIVITY",
        obj                                // this is same as newItem : newItem in ES6
    }
}

export function LoadShared(obj) {
    console.log("Shared files Loaded");
    return {
        type : "LOAD_SHARED",
        obj                                // this is same as newItem : newItem in ES6
    }
}

export function InitializeShared(obj) {
    console.log("Shared files Initialized");
    return {
        type : "INITIALIZE_SHARED",
        obj                                // this is same as newItem : newItem in ES6
    }
}

export function UpdateShared(obj) {
    console.log("file being shared updated");
    return {
        type : "UPDATE_SHARED",
        obj                                // this is same as newItem : newItem in ES6
    }
}