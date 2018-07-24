import React, { Component } from 'react'
import { Grid, Table, Search, Loader, Icon, Image } from 'semantic-ui-react'
import style from '../dashboard/style.js'
import axios from 'axios'
import config from '../config.js'

class StadiumManager extends Component {
	constructor(props) {
		super(props)
		this.state = {
			screenSize: window.screen.width,
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
			managerList: props.managerlist,
			loading: false,
			isLoading: false,
			results: [],
			value: "",
			searchValue: ""
		}
	}
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
		this.resetComponent()
		this.setState({ loading: false })
	}
	resetComponent = () => this.setState({
		isLoading: false,
		results: [],
		value: ''
	})
	handleSearchChange = (e, { value }) => {
		this.setState({ isLoading: true, value: value }, () => {
			setTimeout(() => {
				this.setState({searchValue: value}, () => {
					if (this.state.value.length < 1) 
						this.resetComponent()
					else if (this.state.searchValue === this.state.value) {
						this.setState({
							isLoading: true
						})
						axios.get(`${config.apiBaseURL}/api/user/list?page=1&limit=30&notRole=3&name=${this.state.searchValue}`, {
							"headers": {'Authorization': this.state.userInfo.token}
						})
						.then((response) => {
							let rs = response.data.items.map(x => {
								let isManager = 0
								for (let i = 0; i < this.state.managerList.length; i++) {
									if (this.state.managerList[i].id === x.id) {
										isManager = 1
										break
									}
								}
								return (
									{
										'title': x.first_name + " " + x.last_name,
										'avatar': x.avatar,
										'id': x.id,
										'ismanager': isManager,
										'phone': x.phone
									}
								)
							})
							this.setState({
								results: rs,
								isLoading: false
							})
						})
						.catch((error) => {
							console.log(error)
							this.setState({
								isLoading: false
							})
						})
					}
					else {
						this.setState({
							searchValue: value,
							isLoading: false
						})
					}
				})
			}, 500)
		})
	}
	handleManagerRole = (number) => {
		switch (number) {
			case 1:
				return "Chủ sân"
			case 2:
				return "Quản lý"
			default:
				return "Khác"
		}
	}
	handlePresentResults = (presentResults) => {
		return (
			<div style={{display: "flex", position: "relative", alignItems: "center"}} className="content">
				<Image style={{width: "3em", marginRight: '14px'}} avatar src={presentResults.avatar} />
				<div style={{width: "10em", fontFamily: "roboto"}} className="title">{presentResults.title}</div>
				<div className={(presentResults.ismanager === 0)?"icon-manager-hover":""} onClick={() => {
						if (presentResults.ismanager === 0)
							this.handleAddManager(presentResults.phone)
					}}
					style={
						(presentResults.ismanager === 0)?{
							position: "absolute", right: "-1em", padding: "10px", cursor: "pointer"
						}:{
							position: "absolute", right: "-1em", padding: "10px", cursor: "default"
						}
					}>
					<Icon style={(presentResults.ismanager === 1)?{color: "#006838"}:style.none} name={(presentResults.ismanager === 0)?"add":"check"} />
				</div>
			</div>
		)
	}
	handleAddManager = (phone) => {
		this.setState({ loading: true })
		axios.post(`${config.apiBaseURL}/api/stadium/manager`, {
			phone: phone
		}, {
			headers: {
				'Authorization': this.state.userInfo.token,
				'Content-Type': 'application/json'
			}
		})
		.then((response) => {
			let results = this.state.results
			for (let i = 0; i < results.length; i++) {
				if (results[i].phone === phone) {
					results[i].ismanager = 1
					break
				}
			}
			axios.get(`${config.apiBaseURL}/api/stadium/manager?stadiumID=${this.state.userInfo.default_stadium_id}`, {
				'headers': {'Authorization': this.state.userInfo.token}
			})
			.then((response) => {
				this.setState({
					results: results,
					managerList: response.data.items,
					loading: false
				})
			})
			.catch((error) => {
				console.log(error)
				this.setState({
					loading: false
				})
			})
		})
		.catch((error) => {
			console.log(error.response.data)
			this.setState({
				loading: false
			})
		})
	}
	handleRemoveManager = (number) => {
		this.setState({ loading: true })
		axios.delete(`${config.apiBaseURL}/api/stadium/manager?stadiumID=${this.state.userInfo.default_stadium_id}&managerID=${number}`, {
			headers: {
				'Authorization': this.state.userInfo.token
			}
		})
		.then((response) => {
			let results = this.state.results
			for (let i = 0; i < results.length; i++) {
				if (results[i].id === number) {
					results[i].ismanager = 0
					break
				}
			}
			axios.get(`${config.apiBaseURL}/api/stadium/manager?stadiumID=${this.state.userInfo.default_stadium_id}`, {
				'headers': {'Authorization': this.state.userInfo.token}
			})
			.then((response) => {
				this.setState({
					results: results,
					managerList: response.data.items,
					loading: false
				})
			})
			.catch((error) => {
				console.log(error)
				this.setState({
					loading: false
				})
			})
		})
		.catch((error) => {
			console.log(error.response.data)
			this.setState({
				loading: false
			})
		})
	}
	detectScreenChange = () => {
		this.setState({
			screenSize: window.screen.width
		})
	}
	render() {
		return (
			<Grid>
				<Grid.Row style={style.marginTopBot}>
					<Search style={(this.state.screenSize >= 768)?style.none:style.fullWidth} resultRenderer={this.handlePresentResults} loading={this.state.isLoading}
					onSearchChange={this.handleSearchChange} noResultsMessage="Không tìm thấy"
					results={this.state.results} value={this.state.value} {...this.props} />
				</Grid.Row>
				<Grid.Row style={(this.state.screenSize >= 768)?style.none:{overflowX: "scroll"}}>
					<Table celled striped unstackable={true}>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>STT</Table.HeaderCell>
								<Table.HeaderCell>Tên</Table.HeaderCell>
								<Table.HeaderCell>Số điện thoại</Table.HeaderCell>
								<Table.HeaderCell>Vai trò</Table.HeaderCell>
								<Table.HeaderCell></Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{
								this.state.managerList.map((x, index) => {
									return (
										<Table.Row key={index}>
											<Table.Cell>{x.id}</Table.Cell>
											<Table.Cell>{`${x.first_name} ${x.last_name}`}</Table.Cell>
											<Table.Cell>{x.phone}</Table.Cell>
											<Table.Cell>{this.handleManagerRole(x.stadium_role)}</Table.Cell>
											<Table.Cell textAlign="center">
												<div onClick={() => this.handleRemoveManager(x.id)} className="icon-manager-hover" style={{padding: "10px", cursor: "pointer"}}>
													<Icon size="large" style={{color: "#ed1c24"}} name='close'/>
												</div>
											</Table.Cell>
										</Table.Row>
									)
								})
							}
						</Table.Body>
					</Table>
				</Grid.Row>
				<Loader active={this.state.loading} />
			</Grid>
		)
	}
}

export default StadiumManager