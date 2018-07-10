import React, { Component } from 'react'
import { Menu, Icon, Grid, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import style from '../dashboard/style.js'

class MenuApp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isExpand: ((window.screen.width) >= 768)?(localStorage.getItem('isExpand')?((localStorage.getItem('isExpand') === "true")?true:false):(true)):(true),
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo'))
		}
	}
	stateMenu = { 
		activeItem: this.props.content
	}
	componentWillMount = () => {
		localStorage.setItem('screenSize', window.screen.width.toString())
	}
	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name })
	}
	handleLogOut = () => {
		localStorage.removeItem('MET_userInfo')
		window.location.href = '/login'
	}
	handleMenuChild = () => {
		if (this.state.isExpand === false) {
			this.setState({
				isExpand: true
			}, () => {
				this.props.handleMenuParent(this.state.isExpand)
				localStorage.setItem('isExpand','true')
			})
		}
		else this.setState({
				isExpand: false
			}, () => {
				this.props.handleMenuParent(this.state.isExpand)
				localStorage.setItem('isExpand','false')
			})
	}
	componentDidMount = () => {
		localStorage.setItem('screenSize', window.screen.width.toString())
	}
	render() {
		if (!this.state.userInfo) {
			return <Redirect to="/login"/>
		}
		else {
			const { activeItem } = this.stateMenu
			let urlAvatar = "url(" + this.state.userInfo.avatar + ")"
			let styleAvatar = Object.assign({},style.avartarImage)
			styleAvatar.backgroundImage = urlAvatar
			return (
				<Grid className="menu-grid">
					{
						(this.props.screenSize)?"":(
							<div style={(!this.state.isExpand)?style.flexCenter:style.rowButtonExpand} className="menu-header">
					
								<div className="button-column">
									<Button  onClick={this.handleMenuChild}>
									{
										(this.state.isExpand)?(<Icon name="arrow left" />):(<Icon style={style.margin0} name="arrow right" />)
									}
									</Button>
								</div>
							</div>
						)
					}
					<Link style={style.fullWidth} to="/profile">
						<div style={(this.state.isExpand)?style.userAvatar:style.contentCenter}>
							<div style={styleAvatar}></div>
							{
								(this.state.isExpand)?(
									<div style={style.marginLeftText}><h4 style={style.marginLeftText}>{this.state.userInfo.full_name}</h4></div>
								):""
							}
						</div>
					</Link>	
					{
						(!this.state.isExpand)?"":(<div style={style.marginTopBot}><h3 style={style.colorText}>Quản lý</h3></div>)
					}
					
					<Menu className="menu-menu" secondary vertical>
						<Menu.Item style={(!this.state.isExpand)?style.flexCenter:style.none} as={Link} to="/" name='stadium' active={activeItem === 'stadium'} onClick={this.handleItemClick}>
							<Icon style={style.menuItemIcon} name="clone" />
							{
								(this.state.isExpand)?(<p style={style.marginLeftText}>Quản lý sân</p>):""
							}
						</Menu.Item>
						<Menu.Item style={(!this.state.isExpand)?style.flexCenter:style.none} as={Link} to="/booking" name='booking' active={activeItem === 'booking'} onClick={this.handleItemClick}>
							<Icon style={style.menuItemIcon} name="calendar alternate" />
							{
								(this.state.isExpand)?(<p style={style.marginLeftText}>Quản lý đặt sân</p>):""
							}
						</Menu.Item>
					</Menu>
					<div style={style.fullWidth}><Button onClick={this.handleLogOut} style={style.fullWidth}>
					{
						(this.state.isExpand)?"Đăng xuất":<Icon name="log out" />
					}
					</Button></div>
				</Grid>
			)
		}
	}
}

export default MenuApp;