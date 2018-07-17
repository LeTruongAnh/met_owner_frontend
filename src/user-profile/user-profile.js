import React, { Component } from 'react'
import { Grid, Icon, Sidebar } from 'semantic-ui-react'
import MenuApp from '../dashboard/menu-app.js'
import style from '../dashboard/style'
import ProfileInfo from './profile-info'

class UserProfile extends Component {
	constructor(props){
		super(props)
		this.state = {
			screenSize: window.screen.width,
			menuWidth: (localStorage.getItem('isExpand') === "true")?((window.screen.width > 1024)?3:4):((window.screen.width > 1024)?1:2),
			contentWidth: (localStorage.getItem('isExpand') === "true")?((window.screen.width > 1024)?13:12):((window.screen.width > 1024)?15:14),
			isOn: false,
			visible: false
		}
	}
	handleMenuParent = (param) => {
		if (param === true) {
			if (window.screen.width > 1024) {
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
			if (window.screen.width > 1024) {
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
	detectScreenChange = () => {
		this.setState({
			screenSize: window.screen.width,
			menuWidth: (localStorage.getItem('isExpand') === "true")?((window.screen.width > 1024)?3:4):((window.screen.width > 1024)?1:2),
			contentWidth: (localStorage.getItem('isExpand') === "true")?((window.screen.width > 1024)?13:12):((window.screen.width > 1024)?15:14)
		})
	}
	render() {
		return(
			(this.state.screenSize >= 768)?(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row columns={2}>
						<Grid.Column className="menu-column" width={this.state.menuWidth}>
							<MenuApp handleMenuParent={this.handleMenuParent}/>
						</Grid.Column>
						<Grid.Column className="content-column" width={this.state.contentWidth}>
							<ProfileInfo />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			):(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row columns={1}>
						<Sidebar.Pushable style={style.fullWidth}>
							<Sidebar style={style.menu} animation='overlay' visible={this.state.visible}>
								<MenuApp screenSize={this.state.screenSize}/>
							</Sidebar>
							<Sidebar.Pusher>
								{
									(this.state.visible)?(
										<div onClick={this.handleButtonClick} style={style.bgOverlay} className="bg-overlay"></div>
									):""
								}
								<Grid.Column className="content-column" width={16}>
									<Grid.Row style={{backgroundColor: "#006838", position: "relative", display: "flex", alignItems: "center", justifyContent: "center"}}>
										<div style={{position: "absolute", left: "1em"}} onClick={this.handleButtonClick}>
											<Icon size="large" style={{color: "#fff"}} name="bars"/>
										</div>
										<h3 style={{margin: "auto", padding: "1em 0", color: "#fff"}}>MET</h3>
									</Grid.Row>
									<Grid.Row style={style.marginTopBot}><h1>Thông tin chủ sân</h1></Grid.Row>
									<ProfileInfo />
								</Grid.Column>
							</Sidebar.Pusher>
						</Sidebar.Pushable>
					</Grid.Row>
				</Grid>
			)
		)
	}
}

export default UserProfile