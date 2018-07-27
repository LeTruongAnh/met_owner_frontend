import React, { Component } from 'react'
import { Grid, Form, TextArea, Segment, Button, Image, Search, Modal, Header, Icon, Checkbox, Loader } from 'semantic-ui-react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import config from '../config.js'
import style from '../dashboard/style.js'

class BookingPermanent extends Component {
	constructor(props) {
		super(props)
		let timeNow = new Date()
		this.state = {
			screenSize: window.innerWidth,
			userInfo: (localStorage.getItem('MET_userInfo'))?JSON.parse(localStorage.getItem('MET_userInfo')):{},
			loading: true,
			isLoading1: false,
			results1: [],
			value1: "",
			searchValue1: "",
			typeStadiumValue: 0,
			stadiumChild: props.stadiumchild,
			stadiumChildValue: (props.stadiumchild.length > 0)?props.stadiumchild[0].value:0,
			bookingObject1: 0,
			startDate: null,
			endDate: null,
			startDateUp: 0,
			endDateUp: 0,
			startHour: timeNow.getHours() + 1,
			endHour: timeNow.getHours() + 2,
			startMinute: 0,
			endMinute: 0,
			price: 0,
			phone: "",
			note: "",
			errTeam1: "",
			errStartDate: "",
			errPhone: "",
			errPrice: "",
			reponseNotification: "",
			openErrModal: false,
			loadingBut: false,
			alreadyPaid: 0,
			errAlreadyPaid: "",
			dow: [false,false,false,false,false,false,false],
			errDowUp: "",
			errWeeks: "",
			weeks: 1,
			loadingCheckBox: false
		}
	}
	componentDidMount = () => {
		this.resetComponent1()
		this.setState({ loading: false })
		window.addEventListener('resize',this.detectScreenChange)
	}
	detectScreenChange = () => {
		this.setState({ screenSize: window.innerWidth })
	}
	handleStyleStatusBooking = (number) => {
		switch(number) {
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
	}
	resetComponent1 = () => this.setState({
		isLoading1: false,
		results1: [],
		value1: ''
	})
	handleSearchChange1 = (e, { value }) => {
		this.setState({ isLoading1: true, value1: value }, () => {
			setTimeout(() => {
				this.setState({searchValue1: value}, () => {
					if (this.state.value1.length < 1) 
						this.resetComponent1()
					else if (this.state.searchValue1 === this.state.value1) {
						this.setState({
							isLoading1: true
						})
						axios.get(`${config.apiBaseURL}/api/team/list?rankType=1&page=1&limit=10&name=${this.state.searchValue1}`)
						.then((response) => {
							let rs = response.data.items.map(x => {
								return (
									{
										'title': x.name,
										'avatar': x.image,
										'id': x.id
									}
								)
							})
							this.setState({
								results1: rs,
								isLoading1: false
							})
						})
						.catch((error) => {
							console.log(error)
							this.setState({
								isLoading1: false
							})
						})
					}
					else {
						this.setState({
							searchValue1: value,
							isLoading1: false
						})
					}
				})
			}, 500)
		})
	}
	handleResultSelect1 = (e, { result }) => {
		this.setState({
			value1: result.title
		})
	}
	handlePresentResults= (presentResults) => {
		return (
			<div style={{display: "flex", position: "relative", alignItems: "center"}} className="content">
				<Image style={{width: "3em", marginRight: '14px'}} avatar src={presentResults.avatar} />
				<div style={{width: "10em", fontFamily: "roboto"}} className="title">{presentResults.title}</div>
			</div>
		)
	}
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}
	handleChangeSelect = (e) => {
		this.setState({ [e.target.name]: parseInt(e.target.value, 10) })
	}
	handleCalDowUp = (dow) => {
		let dowUp = []
		for (let i = 0; i < 7; i++) {
			if (dow[i]) dowUp.push(i) 
		}
		return dowUp
	}
	handleGetPrice = () => {
		this.setState({ loading: true })
		let dowUp = this.handleCalDowUp(this.state.dow)
		if ((dowUp.length > 0) && (this.state.startDate !== null) && (this.state.endDate !== null) && (this.state.startDateUp < this.state.endDate.getTime())) {
			axios.get(`${config.apiBaseURL}/api/stadiumchild/price?dow=${JSON.stringify(dowUp)}&scID=${this.state.stadiumChildValue}&dateStarted=${this.state.startDateUp}&dateEnded=${this.state.endDate.getTime()}`, {
				'headers': {'Authorization': this.state.userInfo.token}
			})
			.then((response) => {
				this.setState({
					price: response.data.price,
					loading: false
				})
			})
			.catch((error) => {
				console.log(error)
				this.setState({ loading: false })
			})
		}
		else this.setState({ loading: false })
	}
	handleChangeSelectChildStadium = (e) => {
		let num = parseInt(e.target.value, 10)
		this.setState({
			stadiumChildValue: num
		}, () => this.handleGetPrice())
	}
	handleCreateNumberList = (number) => {
		let lst = []
		for (let i = 0; i < number; i++) {
			lst.push({
				value: i,
				text: (i < 10)?`0${i}`:`${i}`
			})
		}
		return lst
	}
	handleTodayString = () => {
		let today = new Date()
        let months = ['01','02','03','04','05','06','07','08','09','10','11','12']
        let days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
        let year = today.getFullYear()
        let month = months[today.getMonth()]
        let date = (today.getDate() < 10)?("0" + today.getDate()):today.getDate()
        let day = days[today.getDay()]
        let time = day + ", " + date + "/" + month + "/" + year
        return time
	}
	handleCalEndDate = () => {
		let weeks = (isNaN(this.state.weeks))?0:parseInt(this.state.weeks, 10)
		let dowUp = this.handleCalDowUp(this.state.dow)
		if (this.state.startDate && (dowUp.length > 0)) {
			let dayMax = dowUp[0]
			let daysMore = 0
			if (dowUp.length > 1) for (let i = 1; i < dowUp.length; i++) {
				if (dowUp[i] > dayMax) dayMax = dowUp[i]
			}
			let now = new Date()
			if (weeks !== 0) {
				if ((dayMax >= this.state.startDate._d.getDay()) && (this.state.startDate._d.getTime() >= now.getTime())) {
					daysMore = (dayMax - this.state.startDate._d.getDay()) + ((weeks - 1) * 7)
				}
				else  {
					daysMore = weeks * 7
				}
				let endDateUp = this.state.startDate._d.getTime() + (daysMore * 86400000)
				let endDate = new Date(endDateUp)
				endDate.setHours(this.state.endHour)
				endDate.setMinutes(this.state.endMinute)
				this.setState({
					endDate: endDate,
					endDateUp: endDate.getTime()
				}, () => this.handleGetPrice())
			}
			else this.setState({
				endDate: null,
				endDateUp: 0,
				price: 0
			})
		}
	}
	handleChangeStartDate = (date) => {
		if (date) {
			date._d.setHours(this.state.startHour)
			date._d.setMinutes(this.state.startMinute)
			this.setState({
				startDate: date,
				startDateUp: moment(date).valueOf(),
			}, () => this.handleCalEndDate())
		}
	}
	handleChangeWeeks = (e) => {
		let value = e.target.value
		if (!this.state.startDate) {
			this.setState({ weeks: value })
		}
		else {
			this.setState({
				weeks: value
			}, () => this.handleCalEndDate())
		}
	}
	handleChangeSelectStartHour = (e) => {
		let startHour = parseInt(e.target.value, 10)
		if (!this.state.startDate) {
			this.setState({ startHour: startHour })
		}
		else {
			let date = this.state.startDate
			date._d.setHours(startHour)
			this.setState({
				startHour: startHour,
				startDate: date,
				startDateUp: moment(date).valueOf()
			}, () => this.handleGetPrice())
		}
	}
	handleChangeSelectStartMinute = (e) => {
		let startMinute = parseInt(e.target.value, 10)
		if (!this.state.startDate) {
			this.setState({ startMinute: startMinute })
		}
		else {
			let date = this.state.startDate
			date._d.setMinutes(startMinute)
			this.setState({
				startMinute: startMinute,
				startDate: date,
				startDateUp: moment(date).valueOf()
			}, () => this.handleGetPrice())
		}
	}
	handleChangeSelectEndHour = (e) => {
		let endHour = parseInt(e.target.value, 10)
		if (!this.state.endDate) {
			this.setState({ endHour: endHour })
		}
		else {
			let date = this.state.endDate
			date.setHours(endHour)
			this.setState({
				endHour: endHour,
				endDate: date,
				endDateUp: date.getTime()
			}, () => this.handleGetPrice())
		}
	}
	handleChangeSelectEndMinute = (e) => {
		let endMinute = parseInt(e.target.value, 10)
		if (!this.state.endDate) {
			this.setState({ endMinute: endMinute })
		}
		else {
			let date = this.state.endDate
			date.setMinutes(endMinute)
			this.setState({
				endMinute: endMinute,
				endDate: date,
				endDateUp: date.getTime()
			}, () => this.handleGetPrice())
		}
	}
	handleChangeCheckbox = (num) => {
		this.setState({ loadingCheckBox: true})
		let dow = this.state.dow
		dow[num] = !this.state.dow[num]
		this.setState({
			dow: dow,
			loadingCheckBox: false
		}, () => this.handleCalEndDate())
	}
	checkErrorSubmit = () => {
		let isOK = true
		if (this.state.value1 === "") {
			this.setState({
				errTeam1: "Vui lòng nhập tên đội bóng"
			})
			isOK = false
		}
		else {
			this.setState({
				errTeam1: ""
			})
		}
		if (!this.state.startDate) {
			this.setState({
				errStartDate: "Vui lòng chọn ngày bắt đầu"
			})
			isOK = false
		}
		else {
			let today = new Date()
			if (this.state.startDateUp < today.getTime()) {
				this.setState({
					errStartDate: "Thời điểm bắt đầu đã qua"
				})
				isOK = false
			}
			else
				this.setState({
					errStartDate: ""
				})
		}
		if (this.state.phone === "") {
			this.setState({
				errPhone: "Vui lòng nhập số điện thoại đội bóng"
			})
			isOK = false
		}
		else {
			let regPhone = /[0-9]{10,11}/;
			let regBoolPhone = this.state.phone.match(regPhone);
			if (!regBoolPhone) {
				this.setState({
					errPhone: "SĐT không đúng định dạng"
				})
				isOK = false
			}
			else
				this.setState({
					errPhone: ""
				})
		}
		if (this.state.alreadyPaid === "") {
			this.setState({
				errAlreadyPaid: "Vui lòng nhập số tiền đặt cọc"
			})
			isOK = false
		}
		else {
			let boolRegNum = isNaN(this.state.alreadyPaid)
			if (boolRegNum) {
				this.setState({
					errAlreadyPaid: "Vui lòng nhập số vào mục tiền cọc"
				})
				isOK = false
			}
			else
				this.setState({
					errAlreadyPaid: ""
				})
		}
		if (this.state.price === "") {
			this.setState({
				errPrice: "Vui lòng nhập số tiền đặt sân"
			})
			isOK = false
		}
		else {
			let boolRegNum = isNaN(this.state.price)
			if (boolRegNum) {
				this.setState({
					errPrice: "Vui lòng nhập số vào mục tiền sân"
				})
				isOK = false
			}
			else
				this.setState({
					errPrice: ""
				})
		}
		let dowUp = this.handleCalDowUp(this.state.dow)
		if (dowUp.length === 0) {
			this.setState({
				errDowUp: "Vui lòng chọn ít nhất một ngày trong tuần"
			})
			isOK = false
		}
		else this.setState({
				errDowUp: ""
			})
		let weeks = (isNaN(this.state.weeks))?0:parseInt(this.state.weeks, 10)
		if (weeks === 0) {
			this.setState({
				errWeeks: "Vui lòng nhập số tuần lớn hơn 0"
			})
			isOK = false
		}
		else this.setState({
				errWeeks: ""
			})
		return isOK
	}
	handleOnSubmit = () => {
		this.setState({ loadingBut: true })
		if (this.checkErrorSubmit()) {
			let dowUp = this.handleCalDowUp(this.state.dow)
			axios.post(`${config.apiBaseURL}/api/booking/create`, {
				"note": this.state.note,
				"scID": this.state.stadiumChildValue,
				"dateEnded": this.state.endDateUp,
				"alreadyPaid": parseInt(this.state.alreadyPaid, 10),
				"firstTeam": {
					"phone": this.state.phone,
					"name": this.state.value1
				},
				"dateStarted": this.state.startDateUp,
				"price": parseInt(this.state.price, 10),
				"dow": dowUp
			}, {
				'headers': {
	                'Authorization': this.state.userInfo.token,
	                'Content-Type': "application/json"
	            }
			})
			.then((response) => {
				let now = new Date()
				this.setState({
					startDate: null,
					endDate: null,
					startDateUp: 0,
					endDateUp: 0,
					startHour: now.getHours() + 1,
					endHour: now.getHours() + 2,
					startMinute: 0,
					endMinute: 0,
					price: 0,
					phone: "",
					note: "",
					loadingBut: false,
					openErrModal: true,
					reponseNotification: "Đặt sân thành công!",
					isLoading1: false,
					results1: [],
					value1: "",
					searchValue1: "",
					dow: [false,false,false,false,false,false,false],
				})
			})
			.catch((error) => {
				this.setState({
					loadingBut: false,
					openErrModal: true,
					reponseNotification: error.response.data.message
				})
			})
		}
		else {
			this.setState({
				openErrModal: true,
				loadingBut: false 
			})
		}
	}
	handleCloseErrModal = () => {
		this.setState({
			openErrModal: false,
			reponseNotification: ""
		})
	}
	render() {
		return (
			<Segment disabled={this.state.loading} style={style.paddingTotal0}>
				<Loader active={this.state.loading} />
				<Form style={style.fullWidth} onSubmit={this.handleOnSubmit}>
					{
						(this.state.screenSize < 768)?(
							<Grid style={style.margin0} columns={1}>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Loại sân</div>
									</div>
									<select style={style.paddingLeftRight4} name="typeStadiumValue"
									value={this.state.typeStadiumValue} onChange={this.handleChangeSelect}>
										<option value={0}>Nguyên sân</option>
										<option value={1}>Cáp kèo</option>
									</select>
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Sân bóng</div>
									</div>
									<input style={style.paddingLeftRight4} value={this.state.userInfo.stadium.name} readOnly/>
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Sân con</div>
									</div>
									<select style={style.paddingLeftRight4} value={this.state.stadiumChildValue}
									onChange={this.handleChangeSelectChildStadium}>
									{
										this.state.stadiumChild.map(x => {
											return (<option key={x.value} value={x.value}>{x.text}</option>)
										})
									}
									</select>
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Đối tượng đặt sân</div>
									</div>
									<select style={style.paddingLeftRight4} name="bookingObject1" value={this.state.bookingObject1}
									onChange={this.handleChangeSelect}>
										<option value={0}>Đội bóng hệ thống</option>
										<option value={1}>Khách vãng lai</option>
									</select>
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Đội bóng</div>
										<div style={style.styleStarDanger}>*</div>
									</div>
									{
										(!this.state.bookingObject1)?(
											<Search style={style.paddingLeftRight4}
											onResultSelect={this.handleResultSelect1}
											resultRenderer={this.handlePresentResults} loading={this.state.isLoading1}
											onSearchChange={this.handleSearchChange1} noResultsMessage="Không tìm thấy"
											results={this.state.results1} value={this.state.value1} {...this.props} />
										):(
											<input style={style.paddingLeftRight4} name="value1" value={this.state.value1} onChange={this.handleChange}/>
										)
									}
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Ngày bắt đầu</div>
										<div style={style.styleStarDanger}>*</div>
									</div>
									<DatePicker fixedHeight peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="DD/MM/YYYY"
									placeholderText="Chọn ngày bắt đầu" selected={this.state.startDate} onChange={this.handleChangeStartDate} />
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Số tuần</div>
										<div style={style.styleStarDanger}>*</div>
									</div>
									<input name="weeks" type="number" min="1" value={this.state.weeks}
									onChange={this.handleChangeWeeks} />
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Giờ bắt đầu</div>
									</div>
									<Grid columns={2}>
										<Grid.Column width={8}>
											<select className="select-hour" style={style.paddingLeftRight4}
											value={this.state.startHour} onChange={this.handleChangeSelectStartHour}>
											{
												this.handleCreateNumberList(24).map(x => {
													return (<option key={x.value} value={x.value}>{x.text}</option>)
												})
											}
											</select>
										</Grid.Column>
										<Grid.Column width={8}>
											<select className="select-hour" style={style.paddingLeftRight4}
											value={this.state.startMinute} onChange={this.handleChangeSelectStartMinute}>
											{
												this.handleCreateNumberList(60).map(x => {
													return (<option key={x.value} value={x.value}>{x.text}</option>)
												})
											}
											</select>
										</Grid.Column>
									</Grid>
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Giờ kết thúc</div>
									</div>
									<Grid columns={2}>
										<Grid.Column width={8}>
											<select className="select-hour" style={style.paddingLeftRight4}
											value={this.state.endHour} onChange={this.handleChangeSelectEndHour}>
											{
												this.handleCreateNumberList(24).map(x => {
													return (<option key={x.value} value={x.value}>{x.text}</option>)
												})
											}
											</select>
										</Grid.Column>
										<Grid.Column width={8}>
											<select className="select-hour" style={style.paddingLeftRight4}
											value={this.state.endMinute} onChange={this.handleChangeSelectEndMinute}>
											{
												this.handleCreateNumberList(60).map(x => {
													return (<option key={x.value} value={x.value}>{x.text}</option>)
												})
											}
											</select>
										</Grid.Column>
									</Grid>
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Lặp lại hàng tuần vào thứ</div>
										<div style={style.styleStarDanger}>*</div>
									</div>
									<Grid columns={2}>
										<Loader active={this.state.loadingCheckBox} />
										<Grid.Column width={8}>
											<Checkbox style={style.styleCheckboxMobile} label="Chủ nhật" onChange={() => this.handleChangeCheckbox(0)} checked={this.state.dow[0]} />
										</Grid.Column>
										<Grid.Column width={8}>
											<Checkbox style={style.styleCheckboxMobile} label="Thứ hai" onChange={() => this.handleChangeCheckbox(1)} checked={this.state.dow[1]} />
										</Grid.Column>
										<Grid.Column width={8}>
											<Checkbox style={style.styleCheckboxMobile} label="Thứ ba" onChange={() => this.handleChangeCheckbox(2)} checked={this.state.dow[2]} />
										</Grid.Column>
										<Grid.Column width={8}>
											<Checkbox style={style.styleCheckboxMobile} label="Thứ tư" onChange={() => this.handleChangeCheckbox(3)} checked={this.state.dow[3]} />
										</Grid.Column>
										<Grid.Column width={8}>
											<Checkbox style={style.styleCheckboxMobile} label="Thứ năm" onChange={() => this.handleChangeCheckbox(4)} checked={this.state.dow[4]} />
										</Grid.Column>
										<Grid.Column width={8}>
											<Checkbox style={style.styleCheckboxMobile} label="Thứ sáu" onChange={() => this.handleChangeCheckbox(5)} checked={this.state.dow[5]} />
										</Grid.Column>
										<Grid.Column width={8}>
											<Checkbox style={style.styleCheckboxMobile} label="Thứ bảy" onChange={() => this.handleChangeCheckbox(6)} checked={this.state.dow[6]} />
										</Grid.Column>
									</Grid>
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Điện thoại liên hệ</div>
										<div style={style.styleStarDanger}>*</div>
									</div>
									<input style={style.paddingLeftRight4} name="phone" value={this.state.phone} onChange={this.handleChange} />
								</Grid.Column>
								<Grid.Column style={style.paddingTopBot0} width={16}>
									<div style={style.styleLabelDivMobile}>
										<div style={style.displayInlineBlock}>Ghi chú</div>
									</div>
									<TextArea name="note" value={this.state.note} onChange={this.handleChange} />
								</Grid.Column>
								<Grid.Column width={16}>
									<Segment style={{backgroundColor: "rgba(0, 104, 56, 0.8)", color: "#fff", padding: 0}}>
										<div style={{backgroundColor: "rgba(0, 104, 56, 0.9)", padding: "14px"}}>{this.handleTodayString()}</div>
										<div style={{padding: "0 14px"}}>
											<div style={style.styleLabelDivMobile}>
												<div style={style.displayInlineBlock}>Tiền đặt cọc</div>
												<div style={style.styleStarDanger}>*</div>
											</div>
											<input name="alreadyPaid" style={style.paddingLeftRight4} value={this.state.alreadyPaid} onChange={this.handleChange} />
											<div style={style.styleLabelDivMobile}>
												<div style={style.displayInlineBlock}>Tiền sân</div>
												<div style={style.styleStarDanger}>*</div>
											</div>
											<input name="price" style={style.paddingLeftRight4} value={this.state.price} onChange={this.handleChange} />
										</div>
										<div style={{width: "100%", padding: "14px", textAlign: "center"}}>
											<Modal trigger={<Button loading={this.state.loadingBut} onClick={() => this.handleOnSubmit}>Đặt sân</Button>}
											open={this.state.openErrModal} basic size='small'>
												<Header icon='archive' content='Thông báo' />
												<Modal.Actions>
													<Button onClick={this.handleCloseErrModal} basic color='red' inverted>
														<Icon name='remove' /> Đóng
													</Button>
												</Modal.Actions>
												<Modal.Content>
													<p style={(this.state.errTeam1 === "")?style.displayNone:style.styleErrNotification}>{this.state.errTeam1}</p>
													<p style={(this.state.errStartDate === "")?style.displayNone:style.styleErrNotification}>{this.state.errStartDate}</p>
													<p style={(this.state.errDowUp === "")?style.displayNone:style.styleErrNotification}>{this.state.errDowUp}</p>
													<p style={(this.state.errWeeks === "")?style.displayNone:style.styleErrNotification}>{this.state.errWeeks}</p>
													<p style={(this.state.errPhone === "")?style.displayNone:style.styleErrNotification}>{this.state.errPhone}</p>
													<p style={(this.state.errAlreadyPaid === "")?style.displayNone:style.styleErrNotification}>{this.state.errAlreadyPaid}</p>
													<p style={(this.state.errPrice === "")?style.displayNone:style.styleErrNotification}>{this.state.errPrice}</p>
													<p style={(this.state.reponseNotification === "")?style.displayNone:style.styleErrNotification}>{this.state.reponseNotification}</p>
												</Modal.Content>
											</Modal>
										</div>
									</Segment>
								</Grid.Column>
							</Grid>
						):(
							<Grid style={style.margin0} columns={2}>
								<Grid.Column width={10}>
									<Grid columns={2}>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Loại sân</div>
											</div>
											<select style={style.paddingLeftRight4} name="typeStadiumValue" value={this.state.typeStadiumValue} onChange={this.handleChangeSelect}>
												<option value={0}>Nguyên sân</option>
												<option value={1}>Cáp kèo</option>
											</select>
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Sân bóng</div>
											</div>
											<input style={style.paddingLeftRight4} value={this.state.userInfo.stadium.name} readOnly/>
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Sân con</div>
											</div>
											<select style={style.paddingLeftRight4} value={this.state.stadiumChildValue}
											onChange={this.handleChangeSelectChildStadium}>
											{
												this.state.stadiumChild.map(x => {
													return (<option key={x.value} value={x.value}>{x.text}</option>)
												})
											}
											</select>
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Đối tượng đặt sân</div>
											</div>
											<select style={style.paddingLeftRight4} name="bookingObject1" value={this.state.bookingObject1} onChange={this.handleChangeSelect}>
												<option value={0}>Đội bóng hệ thống</option>
												<option value={1}>Khách vãng lai</option>
											</select>
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Đội bóng</div>
												<div style={style.styleStarDanger}>*</div>
											</div>
											{
												(!this.state.bookingObject1)?(
													<Search style={style.paddingLeftRight4}
													onResultSelect={this.handleResultSelect1}
													resultRenderer={this.handlePresentResults} loading={this.state.isLoading1}
													onSearchChange={this.handleSearchChange1} noResultsMessage="Không tìm thấy"
													results={this.state.results1} value={this.state.value1} {...this.props} />
												):(
													<input style={style.paddingLeftRight4} name="value1" value={this.state.value1} onChange={this.handleChange}/>
												)
											}
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Ngày bắt đầu</div>
												<div style={style.styleStarDanger}>*</div>
											</div>
											<DatePicker fixedHeight peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="DD/MM/YYYY"
											placeholderText="Chọn ngày bắt đầu" selected={this.state.startDate} onChange={this.handleChangeStartDate} />
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Số tuần</div>
												<div style={style.styleStarDanger}>*</div>
											</div>
											<input name="weeks" type="number" min="1" value={this.state.weeks}
											onChange={this.handleChangeWeeks} />
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Giờ bắt đầu</div>
											</div>
											<Grid columns={2}>
												<Grid.Column width={8}>
													<select className="select-hour" style={style.paddingLeftRight4}
													value={this.state.startHour} onChange={this.handleChangeSelectStartHour}>
													{
														this.handleCreateNumberList(24).map(x => {
															return (<option key={x.value} value={x.value}>{x.text}</option>)
														})
													}
													</select>
												</Grid.Column>
												<Grid.Column width={8}>
													<select className="select-hour" style={style.paddingLeftRight4}
													value={this.state.startMinute} onChange={this.handleChangeSelectStartMinute}>
													{
														this.handleCreateNumberList(60).map(x => {
															return (<option key={x.value} value={x.value}>{x.text}</option>)
														})
													}
													</select>
												</Grid.Column>
											</Grid>
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={8}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Giờ kết thúc</div>
											</div>
											<Grid columns={2}>
												<Grid.Column width={8}>
													<select className="select-hour" style={style.paddingLeftRight4}
													value={this.state.endHour} onChange={this.handleChangeSelectEndHour}>
													{
														this.handleCreateNumberList(24).map(x => {
															return (<option key={x.value} value={x.value}>{x.text}</option>)
														})
													}
													</select>
												</Grid.Column>
												<Grid.Column width={8}>
													<select className="select-hour" style={style.paddingLeftRight4}
													value={this.state.endMinute} onChange={this.handleChangeSelectEndMinute}>
													{
														this.handleCreateNumberList(60).map(x => {
															return (<option key={x.value} value={x.value}>{x.text}</option>)
														})
													}
													</select>
												</Grid.Column>
											</Grid>
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={16}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Lặp lại hàng tuần vào thứ</div>
												<div style={style.styleStarDanger}>*</div>
											</div>
											<Grid columns={(this.state.screenSize > 1024)?4:3}>
												<Loader active={this.state.loadingCheckBox} />
												<Grid.Column width={(this.state.screenSize > 1024)?4:5}>
													<Checkbox label="Chủ nhật" onChange={() => this.handleChangeCheckbox(0)} checked={this.state.dow[0]} />
												</Grid.Column>
												<Grid.Column width={(this.state.screenSize > 1024)?4:5}>
													<Checkbox label="Thứ hai" onChange={() => this.handleChangeCheckbox(1)} checked={this.state.dow[1]} />
												</Grid.Column>
												<Grid.Column width={(this.state.screenSize > 1024)?4:5}>
													<Checkbox label="Thứ ba" onChange={() => this.handleChangeCheckbox(2)} checked={this.state.dow[2]} />
												</Grid.Column>
												<Grid.Column width={(this.state.screenSize > 1024)?4:5}>
													<Checkbox label="Thứ tư" onChange={() => this.handleChangeCheckbox(3)} checked={this.state.dow[3]} />
												</Grid.Column>
												<Grid.Column width={(this.state.screenSize > 1024)?4:5}>
													<Checkbox label="Thứ năm" onChange={() => this.handleChangeCheckbox(4)} checked={this.state.dow[4]} />
												</Grid.Column>
												<Grid.Column width={(this.state.screenSize > 1024)?4:5}>
													<Checkbox label="Thứ sáu" onChange={() => this.handleChangeCheckbox(5)} checked={this.state.dow[5]} />
												</Grid.Column>
												<Grid.Column width={(this.state.screenSize > 1024)?4:5}>
													<Checkbox label="Thứ bảy" onChange={() => this.handleChangeCheckbox(6)} checked={this.state.dow[6]} />
												</Grid.Column>
											</Grid>
										</Grid.Column>
									</Grid>
								</Grid.Column>
								<Grid.Column width={6}>
									<Grid>
										<Grid.Column style={style.paddingTop0} width={16}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Điện thoại liên hệ</div>
												<div style={style.styleStarDanger}>*</div>
											</div>
											<input style={style.paddingLeftRight4} name="phone" value={this.state.phone} onChange={this.handleChange} />
										</Grid.Column>
										<Grid.Column style={style.paddingTop0} width={16}>
											<div style={style.styleLabelDiv}>
												<div style={style.displayInlineBlock}>Ghi chú</div>
											</div>
											<TextArea name="note" value={this.state.note} onChange={this.handleChange} />
										</Grid.Column>
										<Grid.Column width={16}>
											<Segment style={{backgroundColor: "rgba(0, 104, 56, 0.8)", color: "#fff", padding: 0}}>
												<div style={{backgroundColor: "rgba(0, 104, 56, 0.9)", padding: "14px"}}>{this.handleTodayString()}</div>
												<div style={{padding: "0 14px"}}>
													<div style={style.styleLabelDiv}>
														<div style={style.displayInlineBlock}>Tiền đặt cọc</div>
														<div style={style.styleStarDanger}>*</div>
													</div>
													<input name="alreadyPaid" style={style.paddingLeftRight4} value={this.state.alreadyPaid} onChange={this.handleChange} />
													<div style={style.styleLabelDiv}>
														<div style={style.displayInlineBlock}>Tiền sân</div>
														<div style={style.styleStarDanger}>*</div>
													</div>
													<input name="price" style={style.paddingLeftRight4} value={this.state.price} onChange={this.handleChange} />
												</div>
												<div style={{width: "100%", padding: "14px", textAlign: "center"}}>
													<Modal trigger={<Button loading={this.state.loadingBut} onClick={() => this.handleOnSubmit}>Đặt sân</Button>}
													open={this.state.openErrModal} basic size='small'>
														<Header icon='archive' content='Thông báo' />
														<Modal.Actions>
															<Button onClick={this.handleCloseErrModal} basic color='red' inverted>
																<Icon name='remove' /> Đóng
															</Button>
														</Modal.Actions>
														<Modal.Content>
															<p style={(this.state.errTeam1 === "")?style.displayNone:style.styleErrNotification}>{this.state.errTeam1}</p>
															<p style={(this.state.errStartDate === "")?style.displayNone:style.styleErrNotification}>{this.state.errStartDate}</p>
															<p style={(this.state.errDowUp === "")?style.displayNone:style.styleErrNotification}>{this.state.errDowUp}</p>
															<p style={(this.state.errWeeks === "")?style.displayNone:style.styleErrNotification}>{this.state.errWeeks}</p>
															<p style={(this.state.errPhone === "")?style.displayNone:style.styleErrNotification}>{this.state.errPhone}</p>
															<p style={(this.state.errAlreadyPaid === "")?style.displayNone:style.styleErrNotification}>{this.state.errAlreadyPaid}</p>
															<p style={(this.state.errPrice === "")?style.displayNone:style.styleErrNotification}>{this.state.errPrice}</p>
															<p style={(this.state.reponseNotification === "")?style.displayNone:style.styleErrNotification}>{this.state.reponseNotification}</p>
														</Modal.Content>
													</Modal>
												</div>
											</Segment>
										</Grid.Column>
									</Grid>
								</Grid.Column>
							</Grid>
						)
					}	
				</Form>
			</Segment>
		)
	}
}

export default BookingPermanent