import React, { Component } from 'react'
import { Grid, Form, Button, Image, Icon } from 'semantic-ui-react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import config from '../config.js'
import style from '../dashboard/style.js'

class StadiumForm extends Component {
	constructor(props){
		super(props)
		this.textInput = React.createRef()
		this.state = {
			screenSize: window.screen.width,
			token: JSON.parse(localStorage.getItem('MET_userInfo')).token,
			avatar: props.userInfo.avatar || "",
			phone: props.userInfo.country_code + props.userInfo.phone || "" ,
			firstName: props.userInfo.first_name || "",
			lastName: props.userInfo.last_name || "",
			bio: props.userInfo.bio || "",
			dob: moment(props.userInfo.dob),
			dobUp: moment(props.userInfo.dob).valueOf(),
			errFirstName: "",
			errLastName: "",
			errDob: "",
			loadingBut: false,
			loadingForm: false,
			styleIconChangeAvatar: style.styleIconChangeAvatar,
			styleChangeImage: style.logoImageHover
		}
	}
	handleChangeDate = (date) => {
		this.setState({
			dob: date,
			dobUp: moment(date).valueOf()
		})
	}
	handleSubmit = () => {
		let isOK = true
		if (this.state.firstName === "") {
			this.setState({ errFirstName: "*Vui lòng nhập tên" })
			isOK = false
		}
		else this.setState({ errFirstName: "" })
		if (this.state.lastName === "") {
			this.setState({ errLastName: "*Vui lòng nhập họ"})
			isOK = false
		}
		else this.setState({ errLastName: ""})
		if (this.state.dob) {
			if ((moment().year() - this.state.dob.year()) < 10) {
				this.setState({errDob:"*Bạn phải từ 10 tuổi trở lên"})
				isOK = false
			}
			else
				this.setState({errDob:""})
		}
		if (isOK) {
			this.setState({ loadingBut: true })
			axios.put(`${config.apiBaseURL}/api/user/profile`, {
				"avatar": this.state.avatar,
				"first_name": this.state.firstName,
				"last_name": this.state.lastName,
				"bio": this.state.bio,
				"dob": this.state.dobUp
			}, {
				'headers': {
					'Authorization': this.state.token,
					'Content-Type': 'application/json'
				}
			})
			.then((reponse) => {
				console.log(reponse.data)
				this.setState({
					userInfo: reponse.data,
					loadingBut: false
				}, () => {
					localStorage.setItem('MET_userInfo', JSON.stringify(reponse.data))
					console.log(JSON.parse(localStorage.getItem("MET_userInfo")))
				})
			})
			.catch((error) => {
				console.log(error)
			})
		}
	}
	handleChange = (e) => this.setState({ [e.target.name]: e.target.value })
	detectScreenChange = () => this.setState({ screenSize: window.screen.width })
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
	}
	datePickerInput = () => {
		return (
			<input style={style.fullWidth}></input>
		)
	}
	openImageChangeAvatar = () => {
		this.props.handleTabImage()
	}
	handleMouseOverIconAvatar = () => {
		if (this.state.screenSize >= 768)
			this.setState({
				styleIconChangeAvatar: style.styleIconChangeAvatarHover,
				styleChangeImage: style.logoImageHover
			})
		else
			this.setState({
				styleIconChangeAvatar: style.styleIconChangeAvatarHover,
				styleChangeImage: style.logoImageHover
			})
	}
	handleMouseOutIconAvatar = () => {
		if (this.state.screenSize >= 768)
			this.setState({
				styleIconChangeAvatar: style.styleIconChangeAvatar,
				styleChangeImage: style.logoImage
			})
	}
	render() {
		return (
			<Grid className="grid-form stadium-grid">
				<Grid.Row style={style.marginTopBot} centered={true}>
					{
						(this.state.screenSize >= 768)?(
							<Form style={style.styleStadiumForm} loading={this.state.loadingForm} onSubmit={this.handleSubmit} className="format-form stadium-form">
								<Form.Field style={style.styleFieldAvatar}>
									<div onMouseOver={this.handleMouseOverIconAvatar} onMouseOut={this.handleMouseOutIconAvatar} style={this.state.styleIconChangeAvatar} onClick={this.openImageChangeAvatar}>
										<Icon name="photo" size="large" />
									</div>
									<Image style={this.state.styleChangeImage} src={this.state.avatar} avatar size="small" />
								</Form.Field>
								<Form.Field>
									<label style={style.width30}>Số điện thoại</label>
							      	<input style={style.width70} readOnly name="phone" value={this.state.phone} />
							    </Form.Field>
								<span className="err-span">{this.state.errFirstName}</span>
								<Form.Field>
									<label style={style.width30}>Tên</label>
							      	<input style={style.width70} value={this.state.firstName} name="firstName" onChange={this.handleChange} />
							    </Form.Field>
								<span className="err-span">{this.state.errLastName}</span>
								<Form.Field>
									<label style={style.width30}>Họ</label>
							      	<input style={style.width70} value={this.state.lastName} name="lastName" onChange={this.handleChange} />
							    </Form.Field>
							    <Form.Field>
							    	<label style={style.width30}>Giới thiệu</label>
									<textarea style={style.width70} value={this.state.bio} name="bio" onChange={this.handleChange} />
							    </Form.Field>
							    <span className="err-span">{this.state.errDob}</span>
							    <Form.Field className="date-picker-profile">
									<label style={style.width30}>Ngày sinh</label>
									<DatePicker fixedHeight peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="DD/MM/YYYY"
									placeholderText="Chọn ngày sinh" selected={this.state.dob} onChange={this.handleChangeDate} />
								</Form.Field>
							    <Form.Field>
							    	<Button loading={this.state.loadingBut} className="form-but" type='submit'>Cập nhật</Button>
							    </Form.Field>
						  	</Form>
						):(
							<Form style={style.styleStadiumForm} loading={this.state.loadingForm} onSubmit={this.handleSubmit} className="format-form stadium-form">
								<Form.Field style={style.styleFieldAvatar}>
									<div style={style.styleIconChangeAvatar} onClick={this.openImageChangeAvatar}>
										<Icon name="photo" size="large" />
									</div>
									<Image style={style.logoImage} src={this.state.avatar} avatar size="small"/>
								</Form.Field>
								<Form.Field>
							      	<input value={this.state.phone} readOnly placeholder="Số điện thoại" name="phone" />
							    </Form.Field>
								<span className="err-span">{this.state.errFirstName}</span>
								<Form.Field>
							      	<input value={this.state.firstName} name="firstName" placeholder="Tên" onChange={this.handleChange} />
							    </Form.Field>
								<span className="err-span">{this.state.errLastName}</span>
								<Form.Field>
							      	<input value={this.state.lastName} name="lastName" placeholder="Họ" onChange={this.handleChange} />
							    </Form.Field>
							    <Form.Field>
									<textarea value={this.state.bio} name="bio" placeholder="Giới thiệu" onChange={this.handleChange} />
							    </Form.Field>
							    <span className="err-span">{this.state.errDob}</span>
							    <Form.Field className="date-picker-profile">
									<DatePicker fixedHeight showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="DD/MM/YYYY"
									placeholderText="Chọn ngày sinh" selected={this.state.dob} onChange={this.handleChangeDate} />
								</Form.Field>
							    <Form.Field>
							    	<Button loading={this.state.loadingBut} className="form-but" type='submit'>Cập nhật</Button>
							    </Form.Field>
						  	</Form>
						)
					}
				</Grid.Row>
			</Grid>
		)
	}
}

export default StadiumForm