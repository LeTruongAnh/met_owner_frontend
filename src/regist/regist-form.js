import React, { Component } from 'react'
import { Segment, Button, Checkbox, Form, Grid, Icon, Image } from 'semantic-ui-react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import config from '../config'
import { Redirect } from 'react-router-dom'
import logo from '../asset/favicon.png'
import style from '../dashboard/style.js'

class RegistForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			screenSize: window.innerWidth,
			firstName:"",
			lastName:"",
			phone:"",
			password:"",
			passwordRep:"",
			email:"",
			dob: null,
			dobUp: 0,
			errFirstName:"",
			errLastName:"",
			errPhone: "",
			errPassword:"",
			errPassRep:"",
			errEmail:"",
			errCheckTerm:"",
			errDob: "",
			userInfo: localStorage.getItem('MET_userInfo'),
			loading: false,
			openMessage: false,
			responseNotification: ""
		}
	}
	handleChange = (e, { name, value }) => this.setState({ [name]: value })
	handleChangeDate = (date) => {
		this.setState({
			dob: date,
			dobUp: moment(date).valueOf()
		})
	}
	handleSubmit = () => {
		let isOK = true
		if (this.state.firstName === "") {
			this.setState({
				errFirstName: "*Vui lòng nhập tên"
			});
			isOK = false;
		}
		else {
			this.setState({
				errFirstName: ""
			})
		}
		if (this.state.lastName === "") {
			this.setState({
				errLastName: "*Vui lòng nhập họ"
			});
			isOK = false;
		}
		else 
			this.setState({
				errLastName: ""
			})
		if (this.state.phone === "") {
			this.setState({
				errPhone: "*Vui lòng nhập SĐT"
			});
			isOK = false;
		}
		else {
			var regPhone = /[0-9]{10,11}/;
			var regBoolPhone = this.state.phone.match(regPhone);
			if (!regBoolPhone) {
				this.setState({
					errPhone: "*SĐT không đúng định dạng"
				})
				isOK = false;
			}
			else
				this.setState({
					errPhone: ""
				})
		}
		if (this.state.password === "") {
			this.setState({
				errPassword: "*Vui lòng nhập mật khẩu"
			});
			isOK = false;
		}
		else if (this.state.password.length< 6) {
			this.setState({
				errPassword: "*Mật khẩu phải từ 6 ký tự"
			});
			isOK = false;
		}
		else 
			this.setState({
				errPassword: ""
			})
		if (this.state.passwordRep === "") {
			this.setState({
				errPassRep: "*Vui lòng nhập lại mật khẩu"
			});
			isOK = false;
		}
		else if (this.state.passwordRep !== this.state.password) 
		{
			this.setState({
				errPassRep: "*Mật khẩu không giống"
			});
			isOK = false;
		}
		else 
			this.setState({
				errPassRep: ""
			})
		if ((/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(this.state.email)) || (this.state.email === "")) {
			this.setState({
				errEmail: ""
			})
		}
		else {
			this.setState({
				errEmail: "*Email không đúng định dạng"
			})
			isOK = false;
		}
		if (!document.getElementById('check-regist').checked) {
			this.setState({errCheckTerm:"*Bạn chưa đồng ý với chúng tôi"})
			isOK = false;
		}
		else 
			this.setState({errCheckTerm:""})
		if (this.state.dob) {
			if ((moment().year() - this.state.dob.year()) < 10) {
				this.setState({errDob:"*Bạn phải từ 10 tuổi trở lên"})
				isOK = false
			}
			else
				this.setState({errDob:""})
		}
		if (isOK) {
			this.setState({loading:true})
			axios.post(`${config.apiBaseURL}/api/user/register`, {
				"phone":this.state.phone,
				"firstName":this.state.firstName,
				"lastName":this.state.lastName,
				"password":this.state.password,
				"role":2,
				"dob": this.state.dobUp,
				"email": this.state.email
			})
			.then((response) => {
				this.setState({
					firstName:"",
					lastName:"",
					phone:"",
					password:"",
					passwordRep:"",
					email:"",
					dob:null,
					loading: false,
					openMessage: true,
					responseNotification: "Đăng ký thành công!"
				}, () => setTimeout(() => this.handleCloseMessage(), 3000))
			})
			.catch((error)=> {
				if (!error.response.data)
					this.setState({
						errPhone: "*" + error.response.data.message,
						loading: false
					})
				else this.setState({
						loading: false
					})
			})			
		}
	}
	componentDidMount = () => {
		window.addEventListener('resize',this.detectScreenChange)
	}
	handleCloseMessage = () => {
		this.setState({ openMessage: false })
	}
	detectScreenChange = () => {
		this.setState({ screenSize: window.innerWidth })
	}
	render() {
		if (this.state.userInfo) {
			return <Redirect to="/"/>
		}
		else {
			return (
				<Grid className="grid-form" centered={true}>
					<Form onSubmit={this.handleSubmit} className="format-form regist-form">					
						<Form.Field>
							<Image src={logo} avatar />
							<span className="title-span">ĐĂNG KÝ MET</span>						
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errFirstName}</span>
							<Form.Input iconPosition="left" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder='Tên'>
								<Icon name='user' />
								<input />
							</Form.Input>						
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errLastName}</span>
							<Form.Input iconPosition="left" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder='Họ'>
								<Icon name='users' />
								<input />
							</Form.Input>
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errPhone}</span>
							<Form.Input iconPosition="left" name="phone" value={this.state.phone} onChange={this.handleChange} placeholder='Số điện thoại'>
								<Icon name='phone' />
								<input />
							</Form.Input>
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errPassword}</span>
							<Form.Input iconPosition="left" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder='Mật khẩu'>
								<Icon name='key' />
								<input />
							</Form.Input>
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errPassRep}</span>
							<Form.Input iconPosition="left" type="password" name="passwordRep" value={this.state.passwordRep} onChange={this.handleChange} placeholder='Nhập lại mật khẩu'>
								<Icon name='key' />
								<input />
							</Form.Input>
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errEmail}</span>
							<Form.Input iconPosition="left" name="email" value={this.state.email} onChange={this.handleChange} placeholder='Email'>
								<Icon name='at' />
								<input />
							</Form.Input>
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errDob}</span>
							<DatePicker fixedHeight showMonthDropdown showYearDropdown dropdownMode="select" dateFormat="DD/MM/YYYY" placeholderText="Chọn ngày sinh" selected={this.state.dob} onChange={this.handleChangeDate} />
						</Form.Field>
						<Form.Field>
							<span className="err-span">{this.state.errCheckTerm}</span>
							<Checkbox id="check-regist" label='Tôi đồng ý với các điều khoản và điều kiện' />						
							<a href="https://www.google.com/?gws_rd=ssl" rel="noopener noreferrer" target="_blank">Điều khoản và điều kiện</a>
						</Form.Field>
						<Form.Field>
							<Button className="form-but" loading={this.state.loading} type='submit'>Đăng ký</Button>
						</Form.Field>
						{
							(this.state.openMessage)?(
								<Segment textAlign="right" style={(this.state.screenSize >= 768)?style.styleResponseNotification:style.styleResponseNotificationLoginMobile}>
									<div style={style.marginRight14}>{this.state.responseNotification}</div>
									<Icon style={style.styleRTCloseIcon} name="close" size="small" onClick={this.handleCloseMessage}/>
								</Segment>
							):""
						}
					</Form>
				</Grid>
			);
		}
	}
}

export default RegistForm
