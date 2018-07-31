import React, { Component } from 'react'
import { Grid, Icon, Sidebar } from 'semantic-ui-react'
import MenuApp from '../dashboard/menu-app.js'
import style from '../dashboard/style'
import BookingInfo from './booking-info.js'

class Booking extends Component {
	constructor(props){
		super(props)
		this.state = {
			screenSize: window.innerWidth,
			menuWidth: (localStorage.getItem('isExpand') === "true")?((window.innerWidth > 1024)?3:4):((window.innerWidth > 1024)?1:2),
			contentWidth: (localStorage.getItem('isExpand') === "true")?((window.innerWidth > 1024)?13:12):((window.innerWidth > 1024)?15:14),
			isOn: false,
			visible: false
		}
	}
	detectScreenChange = () => {
		this.setState({
			screenSize: window.innerWidth,
			menuWidth: (localStorage.getItem('isExpand') === "true")?((window.innerWidth > 1024)?3:4):((window.innerWidth > 1024)?1:2),
			contentWidth: (localStorage.getItem('isExpand') === "true")?((window.innerWidth > 1024)?13:12):((window.innerWidth > 1024)?15:14)
		})
	}
	componentWillMount = () => {
		localStorage.setItem('screenSize', window.innerWidth.toString())
	}
	handleMenuParent = (param) => {
		if (param === true) {
			if (window.innerWidth > 1024) {
				this.setState({
					menuWidth: 3,
					contentWidth: 13
				})
			}
			else this.setState({
					menuWidth: 4,
					contentWidth: 12
				})
		}
		else {
			if (window.innerWidth > 1024) {
				this.setState({
					menuWidth: 1,
					contentWidth: 15
				})
			}
			else this.setState({
					menuWidth: 2,
					contentWidth: 14
				})
		}
	}
	componentDidMount = () => {
		window.addEventListener('resize',this.detectScreenChange)
	}
	handleSidebarHide = () => this.setState({ visible: false })
	handleButtonClick = () => this.setState({ visible: !this.state.visible })
	render() {
		return(
			(this.state.screenSize >= 768)?(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row columns={2}>
						<Grid.Column className="menu-column" width={this.state.menuWidth}>
							<MenuApp handleMenuParent={this.handleMenuParent} content="booking"/>
						</Grid.Column>
						<Grid.Column style={style.paddingTotal0} className="content-column" width={this.state.contentWidth}>
							<BookingInfo />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			):(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row columns={1}>
						<Sidebar.Pushable style={style.fullWidth}>
							<Sidebar style={style.menu} animation='overlay' visible={this.state.visible}>
								<MenuApp screenSize={this.state.screenSize} content="booking"/>
							</Sidebar>
							<Sidebar.Pusher>
								{
									(this.state.visible)?(
										<div onClick={this.handleButtonClick} style={style.bgOverlay} className="bg-overlay"></div>
									):""
								}
								<Grid.Column className="content-column" width={16}>
									<Grid.Row style={style.styleMobileHeader}>
										<div style={style.styleMobileHeaderButton} onClick={this.handleButtonClick}>
											<Icon size="large" style={{color: "#fff"}} name="bars"/>
										</div>
										<h3 style={style.styleMobileHeaderTitle}>MET</h3>
									</Grid.Row>
									<BookingInfo />
								</Grid.Column>
							</Sidebar.Pusher>
						</Sidebar.Pushable>
					</Grid.Row>
				</Grid>
			)
		)
	}
}

export default Booking