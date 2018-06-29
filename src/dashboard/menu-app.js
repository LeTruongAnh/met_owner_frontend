import React, { Component } from 'react'
import { Menu, Icon, Grid, Image, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import logo from '../asset/favicon.png'
import style from '../dashboard/style.js'

class MenuApp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isExpand: localStorage.getItem('isExpand')?((localStorage.getItem('isExpand') === "true")?true:false):(true),
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
		localStorage.clear()
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
		const { activeItem } = this.stateMenu
		let urlAvatar = "url(" + this.state.userInfo.avatar + ")"
		let styleAvatar = Object.assign({},style.avartarImage)
		styleAvatar.backgroundImage = urlAvatar
		return (
			<Grid className="menu-grid">
				{
					(this.props.screenSize)?"":(
						<div style={(!this.state.isExpand)?style.flexCenter:style.marginTopBot} className="menu-header">
							{
								(this.state.isExpand)?(
								<div className="logo-name">
									<div><Image style={style.margin0} circular src={logo} size="mini"/></div>
									<div style={style.marginLeftText}><h2>MET</h2></div>
								</div>
								):""
							}
							<div className="button-column">
								<Button onClick={this.handleMenuChild}>
								{
									(this.state.isExpand)?(<Icon name="arrow left" />):(<Icon style={style.margin0} name="arrow right" />)
								}
								</Button>
							</div>
						</div>
					)
				}
				<div style={(this.state.isExpand)?style.userAvatar:style.contentCenter}>
					<div style={styleAvatar}></div>
					{
						(this.state.isExpand)?(
							<div style={style.marginLeftText}><h4 style={style.marginLeftText}>{this.state.userInfo.full_name}</h4></div>
						):""
					}
				</div>
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

export default MenuApp;