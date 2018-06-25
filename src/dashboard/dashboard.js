import React, { Component } from 'react'
import { Grid, Menu } from 'semantic-ui-react'
import MenuApp from './menu-app.js'
import ContentApp from './content-app.js'

class Dashboard extends Component {
	constructor(props){
		super(props)
		this.state = {
			screenSize: window.screen.width
		}
	}
	detectScreenChange = () => {
		this.setState({
			screenSize: window.screen.width
		})
	}
	componentDidMount = () => window.addEventListener('resize',this.detectScreenChange)
	render() {
		return(
			(this.state.screenSize >= 768)?(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row column={2}>
						<Grid.Column className="menu-column" width={4}>
							<MenuApp />
						</Grid.Column>
						<Grid.Column className="content-column" width={12}>
							<ContentApp />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			):(
				<Grid centered={true} className="dashboard-grid">
					<Grid.Row column={1}>
						<Grid.Column className="content-column" width={16}>
							<ContentApp />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			)
		)
	}
}

export default Dashboard;