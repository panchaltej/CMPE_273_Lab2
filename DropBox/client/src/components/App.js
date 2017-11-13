import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import LeftMenu from './LeftMenu';
import TopBar from './TopBar';
import FileGrid from './FileGrid';
import RightMenu from './RightMenu';
import {LoadFiles, LoadShared} from '../actions/index';
import * as FilesAPI from '../api/GetFilesAPI';
import './../public/scooter.css';

class App extends Component {

  componentDidMount(){
    // var userDetail = this.props.userdetail;
    var userId = localStorage.UserId;
    var emailId = localStorage.EmailId;
    var parentId = this.props.files.parentId;
    FilesAPI.getFiles({userId,parentId, emailId})
    .then((obj) => {       
      // this.props.LoadFiles(obj); -----MySQL
      this.props.LoadFiles(obj);
    });
    FilesAPI.getSharedFiles({userId, emailId})
    .then((obj) => {       
      this.props.LoadShared(obj);
    });
  }

  render() {
    return (
      <div className = "row">
        <div className="col-lg-2" id="leftMenuDiv">
          <LeftMenu/>
        </div>
        <div className="col-lg-10">
          <div>
            <TopBar/>
          </div>
          <div className= "row">
            <div className="col-lg-9"><FileGrid/></div>
            <div className="col-lg-3"><RightMenu/></div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({LoadFiles : LoadFiles, LoadShared: LoadShared}, dispatch);
}

function mapStateToProps(state){
  return {
      userdetail: state.userdetail,
      files: state.directory
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
