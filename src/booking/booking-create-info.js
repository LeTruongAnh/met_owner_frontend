import React, { Component } from 'react'
import { Grid, Tab, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import BookingPermanent from './booking-permanent'
import BookingOnce from './booking-once'
import style from '../dashboard/style.js'
import axios from 'axios'
import config from '../config'

class BookingCreateInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			screenSize: window.screen.width,
			userInfo: (localStorage.getItem('MET_userInfo'))?JSON.parse(localStorage.getItem('MET_userInfo')):{},
			loading: true,
			stadiumChild: []
		}
	}
	componentDidMount = () => {
		this.setState({ loading: true })
		window.addEventListener('resize',this.detectScreenChange)
		axios.get(`${config.apiBaseURL}/api/stadium/child?stadiumID=${this.state.userInfo.default_stadium_id}`, {
			'headers': {'Authorization': this.state.userInfo.token}
		})
		.then((response) => {
			let temp = response.data.map(x => {
				return {
					value: x.id,
					text: x.name
				}
			})
			this.setState({
				stadiumChild: temp,
				loading: false
			})
		})
		.catch((error) => {
			console.log(error)
			this.setState({ loading: false })
		})
	}
	detectScreenChange = () => {
		this.setState({ screenSize: window.screen.width })
	}
	render() {
		if (!localStorage.getItem('MET_userInfo'))
			return <Redirect to="/login"/>
		else {
			if (!this.state.loading) {
				return (
					<Grid style={style.marginTotal0px} className="stadium-info">
						<Tab style={style.styleClassInfo} menu={{ secondary: true, pointing: true }} 
						panes={
							[
								{ menuItem: 'Khách vãng lại', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<BookingOnce stadiumchild={this.state.stadiumChild}
									/></Tab.Pane>
								},
								{ menuItem: "Khách cố định", render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<BookingPermanent
									/></Tab.Pane>
								},
							]
						} />
					</Grid>
				)
			}
			else {
				return <Loader active={this.state.loading} />
			}
		}
	}
}

export default BookingCreateInfo