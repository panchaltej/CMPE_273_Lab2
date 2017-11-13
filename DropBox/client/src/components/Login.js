import React, {Component} from 'react';
import { Route, withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import CryptoJS from "crypto-js";
import {connect} from 'react-redux';
import './../public/scooter.css';
import App from "./App";
import Signup from "./Signup";
import UserInfo from "./UserInfo";
import * as LoginAPI from '../api/LoginAPI';
import * as UserAPI from '../api/GetUserAPI';
import {LoadUser, InitializeState} from '../actions/index';


class Login extends Component {

    state = {
        userdata: {
            EmailId: '',
            Password: ''
        },
        isLoggedIn: false,
        message: ''
    };

    handleLogin = () => {
        

        var payload;
        var ciphertext;
        var encrypt;
        ciphertext= CryptoJS.AES.encrypt(this.state.userdata.Password, '852')
        encrypt =ciphertext.toString()
        // payload = {
        //     // EmailId:this.state.userdata.EmailId,
        //     // EncPassword:encrypt,
        //     // Password:this.state.userdata.Password

        //     username:this.state.userdata.EmailId,
        //     // EncPassword:encrypt,
        //     password:this.state.userdata.Password
        // }
        var username=this.state.userdata.EmailId;
        var password=this.state.userdata.Password;

        LoginAPI.doLogin({username, password})
        .then((status) => {
            if (status === 201) {
                this.setState({
                    isLoggedIn: true,
                    message: "Welcome to my App..!!"
                });
                this.getUserDetail();
                //this.props.history.push("/App");
            } else if (status === 401) {
                this.setState({
                    isLoggedIn: false,
                    message: "Wrong username or password. Try again..!!"
                });
            }
        });
    }

    getUserDetail = () => {
        var emailId = this.state.userdata.EmailId;
        UserAPI.getUser({emailId})
        .then((obj) => {       
                this.props.LoadUser(obj);
                if (typeof(Storage) !== "undefined") {
                    localStorage.UserId = obj.UserId;
                    localStorage.EmailId = obj.EmailId;
                }
                this.props.InitializeState();
                this.props.history.push("/App");
        });
    }

    render() {
        return (
            <div>
                <Route
                    exact
                    path="/"
                    render={() => (
                    <div className="row justify-content-md-center">
                        <div className="col-md-3">
                            <form>
                                <div className="form-group">
                                    <h1>Login</h1>
                                </div>
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="Username"
                                        placeholder="Enter Username"
                                        value={this.state.userdata.EmailId}
                                        onChange={(event) => {
                                        this.setState({
                                            userdata: {
                                                ...this.state.userdata,
                                                EmailId: event.target.value
                                            }
                                        });
                                    }}/>
                                </div>
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        type="password"
                                        label="password"
                                        placeholder="Enter Password"
                                        value={this.state.userdata.Password}
                                        onChange={(event) => {
                                        this.setState({
                                            userdata: {
                                                ...this.state.userdata,
                                                Password: event.target.value
                                            }
                                        });
                                    }}/>
                                </div>
                                <div className="form-group">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => this.handleLogin()}>
                                        Submit
                                    </button>
                                </div>
                            </form>
                            <p>Don't have an account yet? 
	                	        <a href="Signup">Sign Up</a>
	                        </p>
                        </div>
                    </div>
                )}/>
                <Route exact path="/App" render={() => (<App/>)}/>
                <Route exact path="/Signup" render={() => (<Signup/>)}/>
                <Route exact path="/UserInfo" render={() => (<UserInfo/>)}/>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        userdetail: state.userdetail
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({LoadUser : LoadUser, InitializeState : InitializeState}, dispatch);
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));