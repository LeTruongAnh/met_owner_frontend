import React, { Component } from 'react'
import { Grid, Button, Icon, Sidebar } from 'semantic-ui-react'
import MenuApp from './menu-app.js'
import style from './style'
import StadiumInfo from '../stadium/stadium-info.js'

class Dashboard extends Component {
	constructor(props){
		super(props)
		this.state = {
			screenSize: window.screen.width,
			menuWidth: (localStorage.getItem('isExpand') === "true")?((parseInt(localStorage.getItem('screenSize'), 10) > 1024)?3:4):((parseInt(localStorage.getItem('screenSize'), 10) > 1024)?1:2),
			contentWidth: (localStorage.getItem('isExpand') === "true")?((parseInt(localStorage.getItem('screenSize'), 10) > 1024)?13:12):((parseInt(localStorage.getItem('screenSize'), 10) > 1024)?15:14),
			isOn: false,
			visible: false
		}
	}
	detectScreenChange = () => {
		this.setState({
			screenSize: window.screen.width
		})
	}
	handleMenuParent = (param) => {
		if (param === true) {
			if (parseInt(localStorage.getItem('screenSize'), 10) > 1024) {
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
			if (parseInt(localStorage.getItem('screenSize'), 10) > 1024) {
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
		localStorage.setItem('screenSize', window.screen.width.toString())
	}
	handleSidebarHide = () => this.setState({ visible: false })
	handleButtonClick = () => this.setState({ visible: !this.state.visible })
	render() {
		console.log(this.state.menuWidth)
		return(
			(this.state.screenSize >= 768)?(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row columns={2}>
						<Grid.Column className="menu-column" width={this.state.menuWidth}>
							<MenuApp handleMenuParent={this.handleMenuParent} content="stadium"/>
						</Grid.Column>
						<Grid.Column className="content-column" width={this.state.contentWidth}>
							<StadiumInfo />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			):(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row columns={1}>
						<Sidebar.Pushable style={style.fullWidth}>
							<Sidebar style={style.menu} animation='overlay' onHide={this.handleSidebarHide} visible={this.state.visible}>
								<MenuApp screenSize={this.state.screenSize} content="stadium"/>
							</Sidebar>
							<Sidebar.Pusher>
								{
									(this.state.visible)?(
										<div onClick={this.handleButtonClick} style={style.bgOverlay} className="bg-overlay"></div>
									):""
								}
								<Grid.Column className="content-column" width={16}>
									<Grid.Row style={style.button}>
										<Button style={style.buttonColor} onClick={this.handleButtonClick}>
											<Icon name="bars"/>
										</Button>
									</Grid.Row>
									<StadiumInfo />
								</Grid.Column>
							</Sidebar.Pusher>
						</Sidebar.Pushable>
					</Grid.Row>
				</Grid>
			)
		)
	}
}

export default Dashboard;