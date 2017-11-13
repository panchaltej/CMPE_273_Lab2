import React, { Component } from 'react';
import { Route, withRouter} from 'react-router-dom';
import user from './../public/user.svg';
import './../public/scooter.css';

class TopBar extends Component {
    render() {return (
        <div className="row">
            <div className="col-lg-10">
                <br/>
                <p className="f1">Home</p>
            </div>
            <div className="col-lg-2">
                <div>
                    <button id="btnUser" type="button" className="c-btn c-btn--tertiary--2"
                        onClick = {() => this.props.history.push("/UserInfo")}>
                        <img type="image/svg+xml" src={user} height="50" alt='logo'/>
                    </button>
                </div>
            </div>
        </div>
      );
    }
}

export default withRouter(TopBar);