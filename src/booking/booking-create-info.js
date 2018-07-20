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
			loading: true
		}
	}
	componentDidMount = () => {
		this.setState({ loading: false })
		window.addEventListener('resize',this.detectScreenChange)
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
								{ menuItem: (this.state.screenSize >= 768)?'Đặt sân 1 lần':'Một lần', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<BookingOnce
									/></Tab.Pane>
								},
								{ menuItem: (this.state.screenSize >= 768)?'Đặt sân nhiều':'Nhiều', render: () => <Tab.Pane className="detail-stadium" attached={false}>
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