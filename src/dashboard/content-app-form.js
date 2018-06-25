import React, { Component } from 'react'
import { Grid, Tab, Form, Image, Input, Icon, Button, Label, Select } from 'semantic-ui-react'
import logo from '../asset/favicon.png'
import axios from 'axios'
import config from '../config'

class ContentAppForm extends Component {
	constructor(props){
		super(props)
		this.state = {
			screenSize: window.screen.width,
			name: "",
			address: "",
			manager: "",
			city: 0,
			district: 0,
			errName: "",
			errAddress: "",
			errManager: "",
			disabled: true,
			cityList: [],
			loading: false,
			districtList: []
		}
	}
	handleSubmit = () => {
		let isOK = true
		if (this.state.name === "") {
			this.setState({errName: "*Vui lòng nhập tên"})
			isOK = false
		}
		else this.setState({ errName: "" })
		if (this.state.address === "") {
			this.setState({errAddress: "*Vui lòng nhập địa chỉ"})
			isOK = false
		}
		else this.setState({ errAddress: "" })
		if (this.state.manager === "") {
			this.setState({errManager: "*Vui lòng nhập quản lý sân"})
			isOK = false
		}
		else this.setState({ errManager: "" })
		if (isOK) {
			this.setState({ loading: true })
			console.log("ok")
		}
	}
	handleChange = (e, { name, value }) => this.setState({ [name]: value })
	handleChangeCity = (e) => {
		var citySelect = e.target.value
		this.setState({
			disabled: false,
			city: citySelect
		})
		console.log(citySelect)
		axios.get(`${config.apiBaseURL}/api/region/district?region=` + citySelect)
		.then((response) => {
			this.setState({
				districtList: response.data.items
			})
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	detectScreenChange = () => this.setState({ screenSize: window.screen.width })
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
		axios.get(`${config.apiBaseURL}/api/region/province`)
		.then((response) => {
			this.setState({
				cityList: response.data.items
			})			
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	render() {
		return (
			<Grid className="grid-form content-tab-form-bg" centered={true}>
			{
				(this.state.screenSize >= 768)?(
					<Form onSubmit={this.handleSubmit} className="format-form content-tab-form">
						<span className="err-span">{this.state.errName}</span>
						<Form.Field>
							<label>Tên</label>
					      	<Form.Input name="name" onChange={this.handleChange} />
					    </Form.Field>
						<span className="err-span">{this.state.errAddress}</span>
						<Form.Field>
							<label>Địa chỉ</label>
					      	<Form.Input name="address" onChange={this.handleChange} />
					    </Form.Field>
						<Form.Field label="Tỉnh/Thành" control="select" onChange={this.handleChangeCity}>
							<option value={0}>Chọn Tỉnh/Thành</option>
							{
								this.state.cityList.map(x => {
									return (
										<option value={x.id}>{x.name}</option>
									)
								})
							}
						</Form.Field>
						<Form.Field label="Quận/Huyện" control="select" disabled={this.state.disabled}>
							<option value={0}>Chọn Quận/Huyện</option>
							{
								this.state.districtList.map(x => {
									return (
										<option value={x.id}>{x.name}</option>
									)
								})
							}
						</Form.Field>
						<span className="err-span">{this.state.errManager}</span>
						<Form.Field>
							<label>Quản lý sân</label>
					      	<Form.Input name="manager" onChange={this.handleChange} />
					    </Form.Field>
					    <Form.Field>
					    	<Button className="form-but" type='submit'>Cập nhật</Button>
					    </Form.Field>
				  	</Form>
				):(
					<Form onSubmit={this.handleSubmit} className="format-form content-tab-form">
						<span className="err-span">{this.state.errName}</span>
						<Form.Field>
					      	<Form.Input placeholder="Tên" name="name" onChange={this.handleChange} />
					    </Form.Field>
						<span className="err-span">{this.state.errAddress}</span>
						<Form.Field>
					      	<Form.Input placeholder="Địa chỉ" name="address" onChange={this.handleChange} />
					    </Form.Field>
						<Form.Field placeholder="Tỉnh/Thành" control="select">
							<option></option>
						{
							this.state.cityList.map(x => {
								return (
									<option value={x.id}>{x.name}</option>
								)
							})
						}
						</Form.Field>
						<Form.Field placeholder="Quận/Huyện" control="select" disabled={this.state.disabled}>
							<option value='male'>Male</option>
							<option value='female'>Female</option>
						</Form.Field>
						<span className="err-span">{this.state.errManager}</span>
						<Form.Field>
					      	<Form.Input placeholder="Quản lý sân" name="manager" onChange={this.handleChange} />
					    </Form.Field>
					    <Form.Field>
					    	<Button loading={this.state.loading} className="form-but" type='submit'>Cập nhật</Button>
					    </Form.Field>
				  	</Form>
				)
			}
			</Grid>
		)
	}
}

export default ContentAppForm;