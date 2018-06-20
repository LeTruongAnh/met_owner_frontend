import React, { Component } from 'react'
import { Button, Form, Grid } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			phone:"",
			password:"",
			errPhone:"",
			errPassword:"",
			errLogin:""
		}
	}
	// componentWillMount() {
	// 	if (MET_userInfo) 
	// }
	handleSubmit = () => {
		let isOK = true;
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
					errPhone: "*SĐT không đúng"
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
		if(isOK) {
			axios.post(`${config.apiBaseURL}/api/user/login`, {
				"phone": this.state.phone,
				"password": this.state.password
			})
			.then(function (response) {
				console.log(response.data);
				if (typeof(Storage) !== "undefined") {
					localStorage.setItem("MET_userInfo", JSON.stringify(response.data));
					console.log(JSON.parse(localStorage.getItem("MET_userInfo")).token);
				}
			})
			.catch((error)=> {
				console.log(error.response);
				var errorMess = '*' + error.response.data.message;
				this.setState({errLogin: errorMess})
			});
		}
	}
	handleChange = (e, { name, value }) => this.setState({ [name]: value })
	render() {
		return (
			<Grid className="grid-form" centered={true}>
				<Form onSubmit={this.handleSubmit} className="format-form login-form ">
					<h1>MET CHỦ SÂN</h1>
				    <Form.Field>
				    	<span>{this.state.errLogin}</span>
				    	<span>{this.state.errPhone}</span>
				      	<Form.Input name="phone" onChange={this.handleChange} placeholder='Số điện thoại' />
				    </Form.Field>
				    <Form.Field>
				    	<span>{this.state.errPassword}</span>
				      	<Form.Input name="password" onChange={this.handleChange} type="password" placeholder='Mật khẩu' />
				    </Form.Field>
				    <Form.Field>
				    	<Button color="green" type='submit'>Đăng nhập</Button>
				    </Form.Field>
				    <Form.Field>
				    	<a href="./register" target="_blank">Đăng ký tài khoản</a>
				    </Form.Field>
			  	</Form>
		  	</Grid>
	  	);
	}
}

export default LoginForm;