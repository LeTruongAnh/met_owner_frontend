import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class MenuApp extends Component {
	state = { 
		activeItem: this.props.content
	}
	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name })
	}
	render() {
		const { activeItem } = this.state
		return (
			<Menu className="menu-menu" secondary vertical>
				<Link to="/"><Menu.Item name='stadium' active={activeItem === 'stadium'} onClick={this.handleItemClick}>Quản lý sân</Menu.Item></Link>
				<Link to="/booking"><Menu.Item name='booking' active={activeItem === 'booking'} onClick={this.handleItemClick}>Quản lý đặt sân</Menu.Item></Link>
			</Menu>
		)
	}
}

export default MenuApp;