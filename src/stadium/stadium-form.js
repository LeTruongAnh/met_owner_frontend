import React, { Component } from 'react'
import { Grid, Form, Button } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'

class StadiumForm extends Component {
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
			disabled: false,
			cityList: [],
			lat: 0,
			lng: 0,
			loadingForm: true,
			loadingBut: false,
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
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
		if (isOK) {
			this.setState({ loadingBut: true })
			axios.put(
				`${config.apiBaseURL}/api/stadium/` + this.state.idStadium,
				{
					"name": this.state.name,
					"address": this.state.address,
					"region": this.state.city,
					"subRegion": this.state.district,
					"lat": this.state.lat,
					"lng": this.state.lng
				},
				{
					'headers': {'Authorization': this.state.userInfo.token, 'Content-Type': 'application/json'}
				}
			)
			.then((response) => {
				console.log(response)
				this.setState({ loadingBut:false })
			})
			.catch((error) => {
				console.log(error.response.data);
				this.setState({ loadingBut:false })
			})
		}
	}
	handleChange = (e, { name, value }) => this.setState({ [name]: value })
	handleChangeCity = (e) => {
		let citySelect = parseInt(e.target.value, 10)
		this.setState({
			disabled: false,
			city: citySelect
		})
		if (citySelect === 0) this.setState({ disabled: true })
		else {
			axios.get(`${config.apiBaseURL}/api/region/district?region=` + citySelect)
			.then((response) => {
				this.setState({
					districtList: response.data.items
				})
			})
			.catch(function (error) {
				console.log(error);
			})
		}
	}
	handleChangeDistrict = (e) => {
		this.setState({
			district: parseInt(e.target.value, 10)
		})
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
		})
		if (this.state.userInfo) {
			axios.get(`${config.apiBaseURL}/api/stadium/` + this.state.userInfo.default_stadium_id, {
				'headers': {'Authorization': this.state.userInfo.token}
			})
			.then((response) => {
				let data = response.data
				axios.get(`${config.apiBaseURL}/api/region/district?region=` + data.region)
				.then((response) => {
					this.setState({
						districtList: response.data.items,
						loadingForm: false
					})
				})
				.catch(function (error) {
					console.log(error);
				})
				this.setState({
					name: data.name,
					address: data.address,
					city: data.region,
					district: data.sub_region,
					lat: data.lat,
					lng: data.lng,
					idStadium: data.id
				})
			})
			.catch(function (error) {
				console.log(error);
			})
		}
	}
	render() {
		return (
			<Grid className="grid-form stadium-grid">
				<Grid.Row>
					<h3>Thông tin</h3>
				</Grid.Row>
				<Grid.Row centered={true}>
					{
						(this.state.screenSize >= 768)?(
							<Form loading={this.state.loadingForm} onSubmit={this.handleSubmit} className="format-form stadium-form">
								<span className="err-span">{this.state.errName}</span>
								<Form.Field>
									<label>Tên</label>
							      	<Form.Input value={this.state.name} name="name" onChange={this.handleChange} />
							    </Form.Field>
								<span className="err-span">{this.state.errAddress}</span>
								<Form.Field>
									<label>Địa chỉ</label>
							      	<Form.Input value={this.state.address} name="address" onChange={this.handleChange} />
							    </Form.Field>
								<Form.Field value={this.state.city} label="Tỉnh/Thành" control="select" onChange={this.handleChangeCity}>
									<option value={0}>Chọn tỉnh/thành</option>
									{
										this.state.cityList.map(x => {
											return (
												<option key={x.id} value={x.id}>{x.name}</option>
											)
										})
									}
								</Form.Field>
								<Form.Field value={this.state.district} label="Quận/Huyện" onChange={this.handleChangeDistrict} control="select" disabled={this.state.disabled}>
									{
										this.state.districtList.map(x => {
											return (
												<option key={x.id} value={x.id}>{x.name}</option>
											)
										})
									}
								</Form.Field>
								<span className="err-span">{this.state.errManager}</span>
							    <Form.Field>
							    	<Button loading={this.state.loadingBut} className="form-but" type='submit'>Cập nhật</Button>
							    </Form.Field>
						  	</Form>
						):(
							<Form loading={this.state.loadingForm} onSubmit={this.handleSubmit} className="format-form stadium-form">
								<span className="err-span">{this.state.errName}</span>
								<Form.Field>
							      	<Form.Input value={this.state.name} placeholder="Tên" name="name" onChange={this.handleChange} />
							    </Form.Field>
								<span className="err-span">{this.state.errAddress}</span>
								<Form.Field>
							      	<Form.Input value={this.state.address} placeholder="Địa chỉ" name="address" onChange={this.handleChange} />
							    </Form.Field>
								<Form.Field value={this.state.city} placeholder="Tỉnh/Thành" control="select" onChange={this.handleChangeCity}>
									{
										this.state.cityList.map(x => {
											return (
												<option key={x.id} value={x.id}>{x.name}</option>
											)
										})
									}
								</Form.Field>
								<Form.Field value={this.state.district} placeholder="Quận/Huyện" onChange={this.handleChangeDistrict} control="select" disabled={this.state.disabled}>
									{
										this.state.districtList.map(x => {
											return (
												<option key={x.id} value={x.id}>{x.name}</option>
											)
										})
									}
								</Form.Field>
								<span className="err-span">{this.state.errManager}</span>
							    <Form.Field>
							    	<Button loading={this.state.loadingBut} className="form-but" type='submit'>Cập nhật</Button>
							    </Form.Field>
						  	</Form>
						)
					}
				</Grid.Row>
				<Grid.Row>
					<h3>Quản lý sân</h3>
				</Grid.Row>
				<Grid.Row centered={true}>
					<Form>
						<Form.Input/>
					</Form>
				</Grid.Row>
			</Grid>
		)
	}
}

export default StadiumForm