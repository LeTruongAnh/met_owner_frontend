import React, { Component } from 'react'
import { Button, Form, Grid, Image, Icon } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'
import { Redirect } from 'react-router-dom'
import logo from '../asset/favicon.png'

class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			phone:"",
			password:"",
			errPhone:"",
			errPassword:"",
			errLogin:"",
			userInfo: localStorage.getItem('MET_userInfo'),
			loading: false
		}
	}
	handleSubmit = () => {
		let isOK = true
		if (this.state.phone === "") {
			this.setState({
				errPhone: "*Vui lòng nhập SĐT"
			})
			isOK = false
		}
		else {
			var reg = /[0-9]{10,11}/
			var regBool = this.state.phone.match(reg)
			if (!regBool) {
				this.setState({
					errPhone: "*SĐT không đúng"
				})
				isOK = false
			}
			else
				this.setState({
					errPhone: ""
				})
		}
		if (this.state.password === "") {
			this.setState({
				errPassword: "*Vui lòng nhập mật khẩu"
			})
			isOK = false
		}
		else 
			this.setState({
				errPassword: ""
			})
		if(isOK) {
			this.setState({loading:true})
			axios.post(`${config.apiBaseURL}/api/user/login`, {
				"phone": this.state.phone,
				"password": this.state.password
			})
			.then((response) => {
				if (typeof(Storage) !== "undefined") {
					localStorage.setItem("MET_userInfo", JSON.stringify(response.data))
					window.location.href = '/'
					this.setState({loading:false})
				}
				else
					alert("Vui lòng sử dụng trình duyệt khác để truy cập!")
			})
			.catch((error) => {
				var errorMess = '*' + error.response.data.message
				this.setState({
					errLogin: errorMess,
					loading:false
				})
			})
		}
	}
	handleChange = (e, { name, value }) => this.setState({ [name]: value })
	render() {
		if (this.state.userInfo) {
			return <Redirect to="/"/>
		}
		else {
			return (
				<Grid className="grid-form" centered={true}>
					<Form onSubmit={this.handleSubmit} className="format-form login-form ">
						<Form.Field>
							<Image src={logo} avatar />
							<span className="title-span">MET CHỦ SÂN</span>						
						</Form.Field>
					    <Form.Field>
					    	<span className="err-span">{this.state.errLogin}</span>
					    	<span className="err-span">{this.state.errPhone}</span>
					      	<Form.Input iconPosition="left" name="phone" onChange={this.handleChange} placeholder='Số điện thoại'>
								<Icon name='phone' />
								<input />
							</Form.Input>
					    </Form.Field>
					    <Form.Field>
					    	<span className="err-span">{this.state.errPassword}</span>
					      	<Form.Input iconPosition="left" type="password" name="password" onChange={this.handleChange} placeholder='Mật khẩu'>
								<Icon name='key' />
								<input />
							</Form.Input>
					    </Form.Field>
					    <Form.Field>
					    	<Button loading={this.state.loading} className="form-but" type='submit'>Đăng nhập</Button>
					    </Form.Field>
					    <Form.Field>
					    	<a href="./register" target="_blank">Đăng ký tài khoản</a>
					    </Form.Field>
				  	</Form>
			  	</Grid>
		  	)
		}
	}
}

export default LoginForm