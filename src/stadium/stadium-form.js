import React, { Component } from 'react'
import { Grid, Form, Button, Image, } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'
import style from '../dashboard/style.js'

class StadiumForm extends Component {
	constructor(props){
		super(props)
		this.textInput = React.createRef()
		this.state = {
			screenSize: window.screen.width,
			cityList: props.cityList || [],
			stadiumData: props.stadiumData || {},
			logoImage: props.stadiumData.image || "",
			bgImage: props.stadiumData.bg_image || "",
			name: props.stadiumData.name || "",
			address: props.stadiumData.address || "",
			city: props.stadiumData.region || 0,
			district: props.stadiumData.sub_region || 0,
			errName: "",
			errAddress: "",
			disabled: false,
			lat: 0,
			lng: 0,
			loadingForm: false,
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
					"image": this.state.logoImage,
					"bgImage": this.state.bgImage,
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
				this.setState({ loadingBut:false })
			})
			.catch((error) => {
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
				console.log("City first OK")
			})
			.catch(function (error) {
				console.log(error)
			})
		}
	}
	handleChangeDistrict = (e) => {
		this.setState({
			district: parseInt(e.target.value, 10)
		})
	}
	detectScreenChange = () => this.setState({ screenSize: window.screen.width })
	componentWillReceiveProps = (nextProps) => {
		console.log('receive props')
		this.setState({
			cityList: nextProps.cityList,
			logoImage: nextProps.stadiumData.image,
			bgImage: nextProps.stadiumData.bg_image,
			name: nextProps.stadiumData.name,
			address: nextProps.stadiumData.address,
			city: nextProps.stadiumData.region
		})
	}
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
		axios.get(`${config.apiBaseURL}/api/region/district?region=` + this.state.stadiumData.region)
		.then((response) => {
			this.setState({
				districtList: response.data.items,
				loadingForm: false
			})
		})
		.catch(function (error) {
			console.log(error)
		})
	}
	render() {
		return (
			<Grid className="grid-form stadium-grid">
				<Grid.Row>
					<h3>Thông tin</h3>
				</Grid.Row>
				<Grid.Row style={style.marginTopBot} centered={true}>
					{
						(this.state.screenSize >= 768)?(
							<Form onSubmit={this.handleSubmit} className="format-form stadium-form">
								<Form.Field>
									<label>Logo sân</label>
									<Image style={style.logoImage} src={this.state.logoImage} />
								</Form.Field>
								<Form.Field style={style.changeImageField} onClick={() => this.props.handleTabImage(1)}>
									<a style={style.changeImage}>Thay đổi logo</a>
								</Form.Field>
								<Form.Field>
									<label>Ảnh nền sân</label>
									<Image style={style.logoImage} src={this.state.bgImage} />
								</Form.Field>
								<Form.Field style={style.changeImageField} onClick={() => this.props.handleTabImage(2)}>
									<a style={style.changeImage}>Thay đổi ảnh nền</a>
								</Form.Field>
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
								<Form.Field style={style.flexCenter}>
									<Image style={style.logoImage} src={this.state.logoImage} />
								</Form.Field>
								<Form.Field style={style.changeImageField} onClick={() => this.props.handleTabImage(1)}>
									<a style={style.changeImage}>Chọn ảnh</a>
								</Form.Field>
								<Form.Field style={style.flexCenter}>
									<Image style={style.logoImage} src={this.state.bgImage} />
								</Form.Field>
								<Form.Field style={style.changeImageField} onClick={() => this.props.handleTabImage(2)}>
									<a style={style.changeImage}>Chọn ảnh</a>
								</Form.Field>
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
			</Grid>
		)
	}
}

export default StadiumForm