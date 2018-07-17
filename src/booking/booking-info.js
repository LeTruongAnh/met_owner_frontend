import React, { Component } from 'react'
import { Header, Table, Grid, Menu, Icon, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import style from '../dashboard/style.js'
import axios from 'axios'
import config from '../config'

class BookingInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			bookingList: [],
			numPagi: [],
			currentPagi: 1,
			loading: false,
			token: (localStorage.getItem('MET_userInfo'))?JSON.parse(localStorage.getItem('MET_userInfo')).token:"",
			screenSize: window.screen.width
		}
	}
	componentDidMount = () => {
		window.addEventListener('resize',this.detectScreenChange)
		this.setState({ loading: true })
		axios.get(`${config.apiBaseURL}/api/booking/list?page=1&limit=0`, {
				'headers': {'Authorization': this.state.token}
			})
		.then((response) => {
			let bookingListLength = response.data.items.length
			let numPagi = (bookingListLength % 10 !== 0)?((bookingListLength - (bookingListLength % 10))/10 + 1):(bookingListLength / 10)
			let listPagi = []
			for (let i = 1; i <= numPagi; i++) listPagi.push(i)
			this.setState({
				numPagi: listPagi
			})
		})
		.catch((error) => {
			console.log(error)
		})
		axios.get(`${config.apiBaseURL}/api/booking/list?page=1&limit=10`, {
			'headers': {'Authorization': this.state.token}
		})
		.then((response) => {
			this.setState({
				bookingList: response.data.items,
				loading: false
			})
		})
		.catch((error) => {
			console.log(error)
		})
	}
	timeConverter = (timeStart, timeEnd) => {
		var a = new Date(timeStart)
		var b = new Date(timeEnd)
		var hourStart = (a.getHours() < 10)?("0" + a.getHours()):a.getHours()
		var minStart = (a.getMinutes() < 10)?("0" + a.getMinutes()):a.getMinutes()
		var hourEnd = (b.getHours() < 10)?("0" + b.getHours()):b.getHours()
		var minEnd = (b.getMinutes() < 10)?("0" + b.getMinutes()):b.getMinutes()
		var time = hourStart + ":" + minStart + " - " + hourEnd + ":" + minEnd
		return time
	}
	dateConverter = (UNIX_timestamp) => {
		var a = new Date(UNIX_timestamp)
		var months = ['01','02','03','04','05','06','07','08','09','10','11','12']
		var year = a.getFullYear()
		var month = months[a.getMonth()]
		var date = (a.getDate() < 10)?("0" + a.getDate()):a.getDate()
		var time = date + "/" + month + "/" + year
		return time
	}
	handlePagination = (number) => {
		let maxNum = this.state.numPagi.length
		switch(number) {
			case this.currentPagi:
				break
			case 0:
				this.setState({ currentPagi: 1 })
				break
			case maxNum + 1:
				this.setState({ currentPagi: maxNum })
				break
			default:
				this.setState({
					loading: true,
					currentPagi: number
				}, () => 
				{
					axios.get(`${config.apiBaseURL}/api/booking/list?page=` + this.state.currentPagi + '&limit=10', {
						'headers': {'Authorization': this.state.token}
					})
					.then((response) => {
						this.setState({
							bookingList: response.data.items,
							loading: false
						})
					})
					.catch((error) => {
						console.log(error)
					})
				}
			)
		}
	}
	detectScreenChange = () => {
		this.setState({
			screenSize: window.screen.width
		})
	}
	render() {
		return (
			<Grid style={style.marginBooking}>
				<Loader active={this.state.loading} />
				<Header style={(this.state.screenSize >= 768)?style.margin0:style.marginTopBot} as="h1">Danh sách đặt sân</Header>
				{
					(this.state.screenSize >= 768)?(
						<Table style={style.marginTable} celled striped>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Mã đặt sân</Table.HeaderCell>
									<Table.HeaderCell>Số điện thoại</Table.HeaderCell>
									<Table.HeaderCell>Sân con</Table.HeaderCell>
									<Table.HeaderCell>Ngày đá</Table.HeaderCell>
									<Table.HeaderCell>Giờ đá</Table.HeaderCell>
									<Table.HeaderCell>Trạng thái</Table.HeaderCell>
									<Table.HeaderCell>Chi tiết</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{
									this.state.bookingList.map((x, index) => {
										return (
											<Table.Row key={index}>
												<Table.Cell>{x.id}</Table.Cell>
												<Table.Cell>{(x.match_id === 0)?x.first_team.phone:x.match.first_team.phone}</Table.Cell>
												<Table.Cell></Table.Cell>
												<Table.Cell>{this.dateConverter(x.date_started)}</Table.Cell>
												<Table.Cell>{this.timeConverter(x.date_started,x.date_ended)}</Table.Cell>
												<Table.Cell style={(() => {
													switch(x.status) {
														case 1:
															return style.pendingColor
														case 2:
														case 7:
															return style.approvedColor
														case 3:
															return style.paymentCompletedColor
														default:
															return style.errorColor
													}
												})()}>
												{(() => {
													switch(x.status) {
														case 1:
															return "Chờ duyệt"
														case 2:
															return "Đã được duyệt"
														case 3:
															return "Đã thanh toán"
														case 4:
															return "Lỗi thanh toán"
														case 5:
															return "Đã từ chối"
														case 6:
															return "Đã hủy"
														case 7:
															return "Đã đặt cọc"
														default:
															return "" 
													}
												})()}
												</Table.Cell>
												<Table.Cell style={style.flexCenter}><Link style={style.detailLink} to={`/booking/${x.id}`}><Icon name="info circle"></Icon></Link></Table.Cell>
											</Table.Row>
										)
									})							
								}
							</Table.Body>
							<Table.Footer>
								<Table.Row>
									<Table.HeaderCell colSpan='7'>
										<Menu floated='right' pagination>
											<Menu.Item onClick={() => this.handlePagination(this.state.currentPagi - 1)} as='a' icon>
												<Icon name='chevron left' />
											</Menu.Item>
											{
												this.state.numPagi.map(x => {
													return <Menu.Item style={(this.state.currentPagi === x)?style.paginationActive:style.none} key={x} onClick={() => this.handlePagination(x)} as='a'>{x}</Menu.Item>
												})
											}
											<Menu.Item onClick={() => this.handlePagination(this.state.currentPagi + 1)} as='a' icon>
												<Icon name='chevron right' />
											</Menu.Item>
										</Menu>
									</Table.HeaderCell>
								</Table.Row>
							</Table.Footer>
						</Table>		
					):(
						<Table style={style.marginTable} celled striped unstackable={true}>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Mã đặt sân</Table.HeaderCell>
									<Table.HeaderCell>Số điện thoại</Table.HeaderCell>
									<Table.HeaderCell>Chi tiết</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{
									this.state.bookingList.map((x, index) => {
										return (
											<Table.Row key={index}>
												<Table.Cell>{x.id}</Table.Cell>
												<Table.Cell>{(x.match_id === 0)?x.first_team.phone:x.match.first_team.phone}</Table.Cell>
												<Table.Cell style={style.flexCenter}><Link style={style.detailLink} to={`/booking/${x.id}`}><Icon name="info circle"></Icon></Link></Table.Cell>
											</Table.Row>
										)
									})							
								}
							</Table.Body>
							<Table.Footer>
								<Table.Row>
									<Table.HeaderCell colSpan='3'>
										<Menu floated='right' pagination>
											<Menu.Item onClick={() => this.handlePagination(this.state.currentPagi - 1)} as='a' icon>
												<Icon name='chevron left' />
											</Menu.Item>
											{
												this.state.numPagi.map(x => {
													return <Menu.Item style={(this.state.currentPagi === x)?style.paginationActive:style.none} key={x} onClick={() => this.handlePagination(x)} as='a'>{x}</Menu.Item>
												})
											}
											<Menu.Item onClick={() => this.handlePagination(this.state.currentPagi + 1)} as='a' icon>
												<Icon name='chevron right' />
											</Menu.Item>
										</Menu>
									</Table.HeaderCell>
								</Table.Row>
							</Table.Footer>
						</Table>
					)
				}	
			</Grid>
		)
	}
}

export default BookingInfo