import React, { Component } from 'react'
import { Button, Checkbox, Form, Grid } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'

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
			dob:null,
			errFirstName:"",
			errLastName:"",
			errPhone: "",
			errPass:"",
			errPassRep:""
			// errCheckTerm:""
		}
	}
	handleChange = (event) => {
		console.log(event)
	}
	handleSubmit = () => {
		let isOK = true
		if (this.state.firstName === "") {
			this.setState({
				errFirstName: "Vui lòng nhập tên"
			});
			isOK = false;
		}
		if (this.state.lastName === "") {
			this.setState({
				errLastName: "Vui lòng nhập họ"
			});
			isOK = false;
		}
		if (this.state.phone === "") {
			this.setState({
				errPhone: "Vui lòng nhập SĐT"
			});
			isOK = false;
		}
		if (this.state.password === "") {
			this.setState({
				errPass: "Vui lòng nhập mật khẩu"
			});
			isOK = false;
		}
		if (this.state.passwordRep === "") {
			this.setState({
				errPassRep: "Vui lòng nhập lại mật khẩu"
			});
			isOK = false;;
		}
		console.log(isOK);
		if (isOK) {
			alert("Bạn đã đăng ký thành công!");
		}
	}
	render() {
		return (
			<Grid className="grid-form" centered={true}>
				<Form onSubmit={this.handleSubmit} className="format-form regist-form">
					<Form.Field>
						<input value={this.state.firstName} onChange={this.handleChange} placeholder='Tên' />
						<span>{this.state.errFirstName}</span>
					</Form.Field>
					<Form.Field>
						<input value={this.state.lastName} onChange={this.handleChange} placeholder='Họ' />
						<span>{this.state.errLastName}</span>
					</Form.Field>
					<Form.Field>
						<input value={this.state.phone} onChange={this.handleChange} placeholder='Số điện thoại' />
						<span>{this.state.errPhone}</span>
					</Form.Field>
					<Form.Field>
						<input value={this.state.password} onChange={this.handleChange} placeholder='Mật khẩu' />
						<span>{this.state.errPass}</span>
					</Form.Field>
					<Form.Field>
						<input value={this.state.passwordRep} onChange={this.handleChange} placeholder='Nhập lại mật khẩu' />
						<span>{this.state.errPassRep}</span>
					</Form.Field>
					<Form.Field>
						<input value={this.state.email} onChange={this.handleChange} placeholder='Email' />
					</Form.Field>
					<DatePicker selected={this.state.dob} onChange={this.handleChange} />
					<Form.Field>
						<Checkbox label='Tôi đồng ý với các điều khoản và điều kiện' />
						<span>{this.state.errCheckTerm}</span>
						<a href="https://www.google.com/?gws_rd=ssl">Điều khoản và điều kiện</a>
					</Form.Field>
					<Button color="green" type='submit'>Đăng ký</Button>
				</Form>
			</Grid>
		);
	}
}

export default RegistForm
