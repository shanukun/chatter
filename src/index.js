import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import LoginComponent from './login/login';
import SignupComponent from './login/signup';
import DashboardComponent from './login/dashboard';


const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyAU-IpgxblGitBO8KO2XKZG38n5gGzSAcM",
    authDomain: "chatter-586c6.firebaseapp.com",
    databaseURL: "https://chatter-586c6.firebaseio.com",
    projectId: "chatter-586c6",
    storageBucket: "chatter-586c6.appspot.com",
    messagingSenderId: "958899200756",
    appId: "1:958899200756:web:17111cde0b29f7bbf9b4a1",
    measurementId: "G-GYBDB7S3EE"
 });

 const routing = (
     <Router>
        <div id="routing-container">
            <Route path="/login" component={LoginComponent} />
            <Route path="/signup" component={SignupComponent} />
            <Route path="/dashboard" component={DashboardComponent} />
        </div>
    </Router>);
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
