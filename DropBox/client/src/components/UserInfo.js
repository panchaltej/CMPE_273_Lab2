import React, {Component} from 'react';
import { Route, withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'; 
import './../public/scooter.css';
import Login from './Login';
import LeftMenu from './LeftMenu';
import * as ActivityAPI from './../api/ActivityAPI';
import * as UserAPI from './../api/GetUserAPI';
import {SaveUserInfo, LoadActivity, LoadUser} from '../actions/index';
import * as UpdateUserAPI from '../api/UpdateUserAPI';


class UserInfo extends Component {
    state = {
        UserId : this.props.userdetail.UserId,
        FirstName : this.props.userdetail.FirstName,
        LastName : this.props.userdetail.LastName,
        EmailId : this.props.userdetail.EmailId,
        Work : this.props.userdetail.Work,
        Education : this.props.userdetail.Education,
        Contact : this.props.userdetail.Contact,
        Interests : this.props.userdetail.Interests
    }

    componentDidMount(){
        // var userDetail = this.props.userdetail
        var emailId = localStorage.EmailId;
        UserAPI.getUser({emailId})
        .then((obj) => {       
                // this.props.LoadUser(obj);
                this.setState({
                    UserId : obj.UserId,
                    FirstName : obj.FirstName,
                    LastName : obj.LastName,
                    EmailId : obj.EmailId,
                    Work : obj.Work,
                    Education : obj.Education,
                    Contact : obj.Contact,
                    Interests : obj.Interests
                }
            );
        });


        var userId = localStorage.UserId;
        ActivityAPI.getActivity({userId, emailId})
        .then((obj) => {       
          this.props.LoadActivity(obj);
        });
      }

    saveUser = () => {
        UpdateUserAPI.updateUser(this.state)
        .then((status) => {       
            if(status ==200){
                this.props.SaveUserInfo(this.state);
            }
        });
    }

    createActivityList(){
        return this.props.activity.activities.map((activityitem) => {
            return(
                    <tr>
                        <td width = "110">
                            <p>{activityitem.ActivityTime.split("GMT")[0]}</p>
                        </td>
                        <td>
                            <p>{activityitem.Description}</p>
                        </td>
                    </tr>
            );
        });
    }

    render() {
        return (
            <div>
                <Route
                    exact
                    path="/UserInfo"
                    render={() => (
                    <div className ="row justify-content-md-center">    
                        <div className="col-lg-2" id="leftMenuDiv">
                            <LeftMenu/>
                        </div>
                        <div id = "userdetail" className="justify-content-md-center col-lg-10">
                            <div id="detail">
                                <p className="f1">User</p>
                                <hr className="hr"/>
                                <div className = "row">
                                    
                                        <div className="col-lg-5">
                                            <p className="f4">First Name</p>
                                            <input
                                                className="form-control"
                                                id="firstname"
                                                type="text"
                                                label="Username"
                                                placeholder="Enter First Name"                                                
                                                value={this.state.FirstName}
                                                onChange = {(event) => 
                                                    {this.setState({
                                                            ...this.state,
                                                            FirstName: event.target.value
                                                        }
                                                    );}}
                                                />

                                            <p className="f4">E-mail:</p>
                                            <input
                                                className="form-control"
                                                id="email"
                                                type="text"
                                                label="Username"
                                                placeholder="Enter EmailID"
                                                value={this.state.EmailId}
                                                disabled/>

                                            <p className="f4">Education:</p>
                                            <input
                                                className="form-control"
                                                id="education"
                                                type="text"
                                                label="Username"
                                                placeholder="Enter Education"
                                                value={this.state.Education}
                                                onChange = {(event) => 
                                                    {this.setState({
                                                            ...this.state,
                                                            Education: event.target.value
                                                        }
                                                    );}}/>

                                            <p className="f4">Interests:</p>
                                            <input
                                                className="form-control"
                                                id="interests"
                                                type="text"
                                                label="Username"
                                                placeholder="Enter your Interests"
                                                value={this.state.Interests}
                                                onChange = {(event) => 
                                                    {this.setState({
                                                            ...this.state,
                                                            Interests: event.target.value
                                                        }
                                                    );}}/>
                                        </div>
                                        <div className="col-lg-6">
                                            <p className="f4">Last Name</p>
                                            <input
                                                className="form-control"
                                                id="lastname"
                                                type="text"
                                                label="Username"
                                                placeholder="Enter Last Name"
                                                value={this.state.LastName}
                                                onChange = {(event) => 
                                                    {this.setState({
                                                            ...this.state,
                                                            LastName: event.target.value
                                                        }
                                                    );}}/>

                                            <p className="f4">Work</p>
                                            <input
                                                className="form-control"
                                                id="work"
                                                type="text"
                                                label="Username"
                                                placeholder="Enter your Work"
                                                value={this.state.Work}
                                                onChange = {(event) => 
                                                    {this.setState({
                                                            ...this.state,
                                                            Work: event.target.value
                                                        }
                                                    );}}/>

                                            <p className="f4">Contact</p>
                                            <input
                                                className="form-control"
                                                id="contact"
                                                type="text"
                                                label="Username"
                                                placeholder="Enter Contact"
                                                value={this.state.Contact}
                                                onChange = {(event) => 
                                                    {this.setState({
                                                            ...this.state,
                                                            Contact: event.target.value
                                                        }
                                                    );}}/>

                                            <button id="saveUser" className="c-btn c-btn--primary c-btn--full" 
                                                onClick={() =>this.saveUser()}>
                                                SAVE
                                            </button>
                                        </div>

                                </div>
                            </div>
                            <div id="activity">
                                <p className="f1">Activity</p>
                                <hr id="ruler" className="hr"/>
                                <table class="c-table--new" id="tableActivity">
                                    <thead>
                                        <th width="110">Time</th>
                                        <th>Description</th>
                                    </thead>
                                    <tbody>
                                        {this.createActivityList()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}/>
                <Route exact path="/" render={() => (<Login/>)}/>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        userdetail: state.userdetail,
        files: state.directory,
        activity: state.activity
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({SaveUserInfo : SaveUserInfo, LoadActivity: LoadActivity, LoadUser: LoadUser},
        dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo));