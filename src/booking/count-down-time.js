import React, { Component } from 'react'
import style from '../dashboard/style.js'

class CountDownTime extends Component {
  constructor() {
    super()
    this.state = {
      time: {},
      seconds: 900
    }
    this.timer = 0
  }
  secondsToTime = (secs) => {
    let divisor_for_minutes = secs % (60 * 60)
    let minutes = Math.floor(divisor_for_minutes / 60)
    let divisor_for_seconds = divisor_for_minutes % 60
    let seconds = Math.ceil(divisor_for_seconds)
    let obj = {
      "m": minutes,
      "s": seconds
    }
    return obj
  }
  componentDidMount = () => {
    this.setState({ seconds: this.props.time }, () => {
      let timeLeftVar = this.secondsToTime(this.state.seconds)
      this.setState({ time: timeLeftVar })
      if (this.timer === 0) this.timer = setInterval(this.countDown, 1000)
    })
  }
  countDown = () => {
    let seconds = this.state.seconds - 1
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    })
    if (seconds === 0) {
      this.props.handleCancel()
      clearInterval(this.timer)
      
    }
  }
  render() {
    return(
      <div style={style.styleTimerCountDown}>
        {(this.state.time.m < 10)?("0"+this.state.time.m):this.state.time.m} : {(this.state.time.s < 10)?("0"+this.state.time.s):this.state.time.s}
      </div>
    )
  }
}

export default CountDownTime