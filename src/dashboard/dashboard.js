import React, { Component } from 'react'
import { Button, Grid, Menu, Label } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

class Dashboard extends Component {
	state = { activeItem: "stadium"}
	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name })
	}
	render() {
		const { activeItem } = this.state
		return (
			<Grid className="menu-grid">
				<Grid.Row>
					<Grid.Column className="menu-column" width={4}>
						<Menu className="menu-menu" secondary vertical>
							<Menu.Item name='stadium' active={activeItem === 'stadium'} onClick={this.handleItemClick}>Quản lý sân</Menu.Item>
							<Menu.Item name='owner' active={activeItem === 'owner'} onClick={this.handleItemClick}>Quản lý chủ sân</Menu.Item>
						</Menu>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}

export default Dashboard;