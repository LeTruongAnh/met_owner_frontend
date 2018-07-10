import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import LoginForm from './login/login-form.js'
import RegistForm from './regist/regist-form.js'
import Stadium from './stadium/stadium.js'
import Booking from './booking/booking.js'
import BookingDetail from './booking/booking-detail.js'
import UserProfile from './user-profile/user-profile.js'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Switch className="router-div">
                        <Route path="/" exact component={Stadium} />
                        <Route path="/login" exact component={LoginForm} />
                        <Route path="/register" exact component={RegistForm} />
                        <Route path="/booking" exact component={Booking} />
                        <Route path="/booking/:bookingID" exact children={
                            ( {match} ) => {
                                return <BookingDetail bookingID={match.params.bookingID}/>
                            }
                        }/>
                        <Route path="/profile" exact component={UserProfile} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App