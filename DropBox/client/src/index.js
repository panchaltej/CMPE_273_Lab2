import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import allReducers from './reducers';
import './index.css';
import Login from './components/Login';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter} from 'react-router-dom';

const store = createStore(allReducers);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    </Provider>
, document.getElementById('root'));
registerServiceWorker();
