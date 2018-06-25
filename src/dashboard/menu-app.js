import React, { Component } from 'react'
import { Grid, Menu } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

class MenuApp extends Component {
	state = { activeItem: "stadium"}
	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name })
	}
	render() {
		const { activeItem } = this.state
		return (
			<div>
				<Menu className="menu-menu" secondary vertical>
					<Menu.Item name='stadium' active={activeItem === 'stadium'} onClick={this.handleItemClick}>Quản lý sân</Menu.Item>
					<Menu.Item name='owner' active={activeItem === 'owner'} onClick={this.handleItemClick}>Quản lý chủ sân</Menu.Item>
				</Menu>
			</div>
		)
	}
}

export default MenuApp;