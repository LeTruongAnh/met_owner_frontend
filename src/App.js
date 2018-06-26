import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import LoginForm from './login/login-form.js'
import RegistForm from './regist/regist-form.js'
import Dashboard from './dashboard/dashboard.js'
import Booking from './booking/booking.js'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <div className="router-div">
                        <Route path="/" exact component={Dashboard} />
                        <Route path="/login" exact component={LoginForm} />
                        <Route path="/register" exact component={RegistForm} />
                        <Route path="/booking" exact component={Booking} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;