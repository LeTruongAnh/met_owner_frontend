import React, { Component } from 'react'
import { Button, Checkbox, Form, Grid } from 'semantic-ui-react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

class RegistForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			firstName:"",
			lastName:"",
			phone:"",
			password:"",
			passwordRep:"",
			email:"",
			dob: null,
			errFirstName:"",
			errLastName:"",
			errPhone: "",
			errPassword:"",
			errPassRep:"",
			errEmail:"",
			errCheckTerm:""
		}
	}
	handleChange = (e, { name, value }) => this.setState({ [name]: value })
	handleChangeDate = (date) => {
		this.setState({dob: date})
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
			var reg = /[0-9]{10,11}/;
			var regBool = this.state.phone.match(reg);
			if (!regBool) {
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
		{
			var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var regBool = this.state.email.match(reg);
			if (this.state.email === "") {
				regBool = true;
			}
			if (!regBool) {
				this.setState({
					errEmail: "*Email không đúng định dạng"
				})
				isOK = false;
			}
			else
				this.setState({
					errEmail: ""
				})
		}
		if (!document.getElementById('check-regist').checked) {
			this.setState({errCheckTerm:"*Bạn chưa đồng ý với chúng tôi"})
			isOK = false;
		}
		else 
			this.setState({errCheckTerm:""})
		if (isOK) {
			alert("Bạn đã đăng ký thành công!");
			this.setState({
				firstName:"",
				lastName:"",
				phone:"",
				password:"",
				passwordRep:"",
				email:"",
				dob:null
			})
			document.getElementById('check-regist').checked = false;
		}
	}
	render() {
		return (
			<Grid className="grid-form" centered={true}>
				<Form onSubmit={this.handleSubmit} className="format-form regist-form">
					<h1>ĐĂNG KÝ MET</h1>
					<Form.Field>
						<span>{this.state.errFirstName}</span>
						<Form.Input name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder='Tên' />						
					</Form.Field>
					<Form.Field>
						<span>{this.state.errLastName}</span>
						<Form.Input name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder='Họ' />						
					</Form.Field>
					<Form.Field>
						<span>{this.state.errPhone}</span>
						<Form.Input name="phone" value={this.state.phone} onChange={this.handleChange} placeholder='Số điện thoại' />						
					</Form.Field>
					<Form.Field>
						<span>{this.state.errPassword}</span>
						<Form.Input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder='Mật khẩu' />						
					</Form.Field>
					<Form.Field>
						<span>{this.state.errPassRep}</span>
						<Form.Input type="password" name="passwordRep" value={this.state.passwordRep} onChange={this.handleChange} placeholder='Nhập lại mật khẩu' />						
					</Form.Field>
					<Form.Field>
						<span>{this.state.errEmail}</span>
						<Form.Input name="email" value={this.state.email} onChange={this.handleChange} placeholder='Email' />
					</Form.Field>
					<Form.Field>
						<DatePicker placeholderText="Chọn ngày sinh" selected={this.state.dob} onChange={this.handleChangeDate} />
					</Form.Field>
					<Form.Field>
						<span>{this.state.errCheckTerm}</span>
						<Checkbox id="check-regist" label='Tôi đồng ý với các điều khoản và điều kiện' />						
						<a href="https://www.google.com/?gws_rd=ssl" target="_blank">Điều khoản và điều kiện</a>
					</Form.Field>
					<Button color="green" type='submit'>Đăng ký</Button>
				</Form>
			</Grid>
		);
	}
}

export default RegistForm
