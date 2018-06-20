import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import LoginForm from './login/login-form.js'
import RegistForm from './regist/regist-form.js'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router className="route-login">
                    <Route path="/login" component={LoginForm} />
                </Router>
                <Router className="route-regist">
                    <Route path="/register" component={RegistForm} />
                </Router>
                <Router>
                    <Route path="/" component={Dashboard} />
                </Router>
            </div>
        );
    }
}

export default App;