import React, { Component } from 'react';
import './../public/scooter.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import starred from './../public/starred.svg';
import star from './../public/star_white.svg';
import file from './../public/file.svg';
import folder from './../public/folder.svg';
import deleteicon from './../public/delete.svg';
import {HandleStar} from '../actions/index';
import {UpdateParent} from '../actions/index';
import {LoadFolder, UpdateShared, LoadFiles} from '../actions/index';
import * as updateFileAPI from '../api/UpdateFileAPI';
import * as FilesAPI from '../api/GetFilesAPI';
import * as DownloadAPI from '../api/DownloadFileAPI';
import * as deleteFileAPI from '../api/DeleteFileAPI';
import fileDownload from 'react-file-download';
import Axios from 'axios';
import RightMenu from './RightMenu';

class FileGrid extends Component {

    handleClick(fileitem){
        if(fileitem.Type == 0)
        {
            DownloadAPI.downloadFile(fileitem)
            .then((res) => {       
                Axios.get(res.url)
                .then((response) => {
                     fileDownload(response.data, 'download');
                });
                //fileDownload(res.data, 'filename');
                //window.open(res.url);
            });
        }
        else{
            Promise.resolve(this.props.UpdateParent(fileitem))
            .then(() =>{
                //var userDetail = this.props.userdetail;
                var userId = localStorage.UserId;
                var emailId = localStorage.EmailId;
                var parentId = this.props.files.parentId;
                FilesAPI.getFiles({userId,parentId, emailId})
                .then((obj) => {       
                this.props.LoadFolder(obj);
                });
            });
        }
    }

    setParent(){
        //var userDetail = this.props.userdetail;
        var userId = localStorage.UserId;
        var parentId = this.props.files.parentId;
        FilesAPI.getFiles({userId,parentId})
        .then((obj) => {       
          this.props.LoadFolder(obj);
        });
    }

    updateStarred(fileitem){

        var emailId = localStorage.EmailId;
        // updateFileAPI.updateFile(fileitem)
        updateFileAPI.updateFile({fileitem, emailId})
        .then((status) => {
            if(status == 201){
                this.props.HandleStar(fileitem);
            }    
            else{
                console.log("Error Occured while updating file.");
            }   
        });
        
    }

    updateDelete(fileitem){

        var emailId = localStorage.EmailId;
        deleteFileAPI.deleteFile({fileitem, emailId})
        .then((status) => {
            if(status == 201){
                console.log("File Deleted");
                var userId = localStorage.UserId;
                var emailId = localStorage.EmailId;
                var parentId = this.props.files.parentId;
                FilesAPI.getFiles({userId,parentId, emailId})
                .then((obj) => {       
                  this.props.LoadFiles(obj);
                });
            }    
            else{
                console.log("Error Occured while updating file.");
            }   
        });
        
    }

    renderIcon(fileitem){
        if(fileitem.Type == 0){
        return(
            <img type="image/svg+xml" src={file} height="30px" alt='logo'/>
        )}
        else{
        return(
            <img type="image/svg+xml" src={folder} height="30px" alt='logo'/>
        )}
    }

    renderStarButton(fileitem){
        if(fileitem.IsStarred == 1){
        return(
            <button type="button" className="c-btn c-btn--tertiary--2"
            onClick={() => this.updateStarred(fileitem)}>
                <img type="image/svg+xml" src={starred} height="15px" alt='logo'/>
            </button>
        )}
        else{
        return(
            <button type="button" className="c-btn c-btn--tertiary--2"
            onClick={() => this.updateStarred(fileitem)}>
                <img type="image/svg+xml" src={star} height="15px" alt='logo'/>
                {/* <object type="image/svg+xml" data={star} height="15px">
                    logo
                </object> */}
            </button>
        )}
    }

    openShare(fileitem){
        var sharediv = document.getElementById("divShare");
        var sharefilelbl = document.getElementById("lblSharefile");
        if((sharefilelbl.innerHTML != "Share "+fileitem.Name+" with:") || sharediv.hidden){
            sharefilelbl.innerHTML = "Share "+fileitem.Name+" with:";
            sharediv.hidden = false;
        }
        else{
            sharediv.hidden = true;
        }
        this.props.UpdateShared(fileitem);
    }

    createItemsList(){
        if(this.props.files.files){
        return this.props.files.files.map((fileitem) => {
            return(
                    <tr>
                        <td width = "30">
                            {this.renderIcon(fileitem)}
                        </td>
                        <td>
                            <button
                                className="c-btn c-btn--tertiary--3"
                                type="button"
                                onClick={() => this.handleClick(fileitem)}>
                                    {fileitem.Name}
                            </button>
                        </td>
                        <td width = "40">
                            {this.renderStarButton(fileitem)}
                        </td>
                        <td width = "40">
                            <button className="c-btn c-btn--tertiary" onClick={() => this.openShare(fileitem)}>
                                SHARE
                            </button>
                        </td>
                        <td width = "40">
                            <button type="button" className="c-btn c-btn--tertiary--2" onClick={() => this.updateDelete(fileitem)}>
                                <img type="image/svg+xml" src={deleteicon} height="17px" alt='logo'/>
                            </button>
                        </td>
                        {/* <td>{fileitem.UserId}</td>
                        <td>{fileitem.Members}</td> */}
                    </tr>
            );
        });
    }
    }

    createSharedList(){
        if(this.props.shared.sharedfiles && this.props.shared.sharedfiles.length == 0)
        {
            return(
                    <div class="c-banner c-banner--unpinned f4">
                        Nothing has been shared with you for now.
                    </div>
                );
            }
        else{
            return this.props.shared.sharedfiles.map((fileitem) => {
                return(
                        <tr>
                            <td width = "30">
                                {this.renderIcon(fileitem)}
                            </td>
                            <td>
                                <button
                                    className="c-btn c-btn--tertiary--3"
                                    type="button"
                                    onClick={() => this.handleClick(fileitem)}>
                                        {fileitem.Name}
                                </button>
                            </td>
                        </tr>
                    );
                });
            }
    }

    createStarredList(){
        var count = 0;
        if(this.props.files.files){
        this.props.files.files.map((fileitem) => {
            if(fileitem.IsStarred === 1) count ++;
        });
        if(count == 0)
        {
            return(
                    <div class="c-banner c-banner--unpinned f4">
                        When you star items, they’ll show up here for easy access.
                    </div>
                );
            }
        else{
            return this.props.files.files.map((fileitem) => {
                if(fileitem.IsStarred === 1){
                    return(
                        <tr>
                            <td width = "30">
                                {this.renderIcon(fileitem)}
                            </td>
                            <td>
                                <button
                                    className="c-btn c-btn--tertiary--3"
                                    type="button"
                                    onClick={() => this.handleClick(fileitem)}>
                                        {fileitem.Name}
                                </button>
                            </td>
                            <td width = "40">
                                {this.renderStarButton(fileitem)}
                            </td>
                            {/* <td>{fileitem.UserId}</td>
                            <td>{fileitem.Members}</td> */}
                        </tr>
                    );}
                });
            }
        }
        else{
            return(
                <div class="c-banner c-banner--unpinned f4">
                    When you star items, they’ll show up here for easy access.
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <p className="f4">Starred</p>
                <hr className="hr"/>
                <table class="c-table">
                    <tbody>
                    {this.createStarredList()}
                    </tbody>
                </table>

                <p className="f4">Shared with me</p>
                <hr className="hr"/>
                <table class="c-table">
                    {/* <thead>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Members</th>
                    </thead> */}
                    <tbody>
                    {this.createSharedList()}
                    </tbody>
                </table>

                <p className="f4">My Files</p>
                <hr className="hr"/>
                <table class="c-table">
                    {/* <thead>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Members</th>
                    </thead> */}
                    <tbody>
                    {this.createItemsList()}
                    </tbody>
                </table>
            </div>
        );
    }  
}

function mapStateToProps(state){
    return {
        userdetail: state.userdetail,
        files: state.directory,
        shared: state.shared
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({HandleStar : HandleStar, 
        UpdateParent: UpdateParent,
        LoadFolder: LoadFolder,
        LoadFiles: LoadFiles,
        UpdateShared: UpdateShared},
        dispatch);
  }

export default connect(mapStateToProps, mapDispatchToProps)(FileGrid);