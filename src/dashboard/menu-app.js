import React, { Component } from 'react'
import { Menu, Icon, Grid, Button, Modal, Header, Divider, Dropdown, Loader } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import config from '../config.js'
import axios from 'axios'
import style from '../dashboard/style.js'

class MenuApp extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isExpand: (
				(window.screen.width) >= 768)?(
					localStorage.getItem('isExpand')?(
						(localStorage.getItem('isExpand') === "true")?true:false
					):(true)
				):(true
			),
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
			openModal: false,
			stadiumList: [],
			defaultStadium: JSON.parse(localStorage.getItem('MET_userInfo')).stadium.name,
			loading: true
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
	handleLogOutCancel = () => {
		this.setState({ openModal: false })
	}
	handleOpenModal = () => {
		this.setState({ openModal: true })
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
		axios.get(`${config.apiBaseURL}/api/stadium/list?page=1&limit=10`, {
            'headers': {'Authorization': this.state.userInfo.token}
        })
        .then((response) => {
        	let temp = {
	        	key: this.state.userInfo.default_stadium_id,
	        	value: this.state.userInfo.default_stadium_id,
	        	text: this.state.userInfo.stadium.name
	        }
        	let stadiumList = response.data.items.map(x => {
            	return ({
            		key: x.id,
                	value: x.id,
                	text: x.name
            	})
            })
        	stadiumList.unshift(temp)
            this.setState({
                stadiumList: stadiumList,
                loading: false
            })
        })
        .catch((error) => {
            console.log(error)
            this.setState({ loading: false })
        })
		this.setState({ loading: false })
	}
	handleChangeDefaulStadium = (event, object) => {
		if(object.value !== this.state.userInfo.default_stadium_id) {
			this.setState({ loading: true })
	  		axios.put(`${config.apiBaseURL}/api/user/profile`, {
				"default_stadium_id": object.value
			}, {
				'headers': {
					'Authorization': this.state.userInfo.token,
					'Content-Type': 'application/json'
				}
			})
			.then((response) => {
				console.log(response.data)
				this.setState({
					userInfo: response.data
				}, () => {
					axios.get(`${config.apiBaseURL}/api/stadium/list?page=1&limit=10`, {
			            'headers': {'Authorization': this.state.userInfo.token}
			        })
			        .then((response) => {
			        	console.log(response.data)
			        	this.setState({
			        		stadiumList: response.data.items,
			        		defaultStadium: object.text,
			        		loading: false
			        	}, () => window.location.reload())
			        })
			        .catch((error) => {
			            console.log(error)
			            this.setState({ loading: false })
			        })
			        localStorage.setItem('MET_userInfo', JSON.stringify(response.data))
				})
			})
			.catch((error) => {
				console.log(error)
				this.setState({ loading: false })
			})
		}
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
					<Grid.Row>
						{
							(!this.state.isExpand)?"":(<div style={style.marginLeftText}><h3>Sân mặc định</h3></div>)
						}
						<Dropdown style={style.marginTotal14px} text={this.state.defaultStadium}
							search selection options={this.state.stadiumList} onChange={this.handleChangeDefaulStadium}
						/>
					</Grid.Row>
					<Divider style={style.fullWidth}/>
					{
						(!this.state.isExpand)?"":(<div><h3 style={style.colorText}>Quản lý</h3></div>)
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
					<Modal open={this.state.openModal} trigger={
							<div style={style.fullWidth}><Button onClick={this.handleOpenModal} style={style.fullWidth}>
							{
								(this.state.isExpand)?"Đăng xuất":<Icon name="log out" />
							}
							</Button></div>
						} basic size='small'>
						<Header icon='archive' content='Tin nhắn xác nhận:' />
						<Modal.Content>
							<p>Bạn có chắc chắn muốn đăng xuất không?</p>
						</Modal.Content>
						<Modal.Actions>
							<Button onClick={this.handleLogOutCancel} basic color='red' inverted>
								<Icon name='remove' /> Không
							</Button>
							<Button onClick={this.handleLogOut} color='green' inverted>
								<Icon name='checkmark' /> Có
							</Button>
						</Modal.Actions>
					</Modal>
					<Loader active={this.state.loading} />
				</Grid>
			)
		}
	}
}

export default MenuApp;