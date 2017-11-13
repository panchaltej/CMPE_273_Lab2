import React, { Component } from 'react';
import './../public/scooter.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as UploadFileAPI from '../api/UploadFileAPI';
import * as CreateFolderAPI from '../api/CreateFolderAPI';
import * as FilesAPI from '../api/GetFilesAPI';
import {LoadFiles} from '../actions/index';

class RightMenu extends Component {
    state = {
        members: ''
    }

    handleShared(){
        var file = this.props.shared.fileshared;
        var members = this.state.members;
        FilesAPI.ShareFile({file, members})
        .then((status) => {
            if(status == 200){
                var sharediv = document.getElementById("divShare");
                sharediv.hidden = true;
            }
        });
    }

    createFolder() {
        var folder = document.getElementById('newFolder');
        var foldername = folder.value;
        // var userDetail = this.props.userdetail;
        var userId = localStorage.UserId;
        var parentId = this.props.files.parentId;
        var emailId = localStorage.EmailId;
        CreateFolderAPI.createFolder({userId, parentId, foldername})
        .then((status) => {
            if(status == 200){
                console.log("Folder created");
                // var userDetail = this.props.userdetail;
                // var userId = localStorage.UserId;
                // var parentId = this.props.files.parentId;
                FilesAPI.getFiles({userId, parentId, emailId})
                    .then((obj) => {       
                    this.props.LoadFiles(obj);
                });
            }    
            else{
                console.log("Error Occured while updating file.");
            }   
        });
      }

    uploadRequest( infile ) {
        var file = infile[0];  
        let data = new FormData();
        data.append('file',file);
        data.append('userId', localStorage.UserId);
        data.append('name', file.name);
        data.append('parentId', this.props.files.parentId);
        UploadFileAPI.uploadFile(data)
        .then((status) => {
            if(status == 200){
                console.log("Upload Success");
                //var userDetail = this.props.userdetail;
                var userId = localStorage.UserId;
                var parentId = this.props.files.parentId;
                var emailId = localStorage.EmailId;
                FilesAPI.getFiles({userId, parentId, emailId})
                    .then((obj) => {       
                    this.props.LoadFiles(obj);
                    // this.props.LoadFiles(obj.result[0]);
                });
            }    
            else{
                console.log("Error Occured while updating file.");
            }   
        });
      }

    render() {return (
        <div id="divRightMenu">
            <form enctype="multipart/form-data">
            <div className="form-group">
                <p id="uploadFile" className="f4">Choose a file to upload</p>
                <input name='inputFile' type="file"  className='c-input' onChange={(event) => this.uploadRequest(event.target.files)}/>
            </div>
            </form>
            <br/>
            <br/>
            <div id="divNewFolder">
                <input name='newFolder' placeholder="Enter Folder Name" id='newFolder' type="text"  className='c-input'/>
                <button className="c-btn c-btn--tertiary c-btn--full" onClick ={() => this.createFolder()}>New Folder</button>
            </div>
            <br/>
            <br/>
            <div id = "divShare" class="c-banner c-banner--unpinned" hidden>
                <form>
                    <div className="form-group">
                        <p id="lblSharefile" className="f4"></p>
                        <input name='inputFile' type="text"  className='c-input' onChange={(event) => 
                            this.setState({
                                members: event.target.value
                            })
                        }/>
                        <button className = "c-btn c-btn--primary c-btn--full" onClick={()=>this.handleShared()}>Share</button>
                    </div>
                    **Comma separate multiple members    
                </form>
            </div>
            
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
    return bindActionCreators({LoadFiles : LoadFiles}, dispatch);
  }

export default connect(mapStateToProps, mapDispatchToProps)(RightMenu);