import React, { Component } from 'react'
import { Grid, Form, Button, Image, Icon } from 'semantic-ui-react'
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
			lat: props.stadiumData.lat,
			lng: props.stadiumData.lng,
			errName: "",
			errAddress: "",
			disabled: false,
			loadingForm: true,
			loadingBut: false,
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
			districtList: [],
			styleIconChangeLogo: style.changeImage,
			styleIconChangeCover: style.changeImage
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
				`${config.apiBaseURL}/api/stadium/` + this.state.userInfo.default_stadium_id,
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
					'headers': {
						'Authorization': this.state.userInfo.token,
						'Content-Type': 'application/json'
					}
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
	handleChange = (e) => this.setState({ [e.target.name]: e.target.value })
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
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
		axios.get(`${config.apiBaseURL}/api/region/district?region=` + this.state.stadiumData.region)
		.then((response) => {
			this.setState({
				districtList: response.data.items,
				loadingForm: false
			})
		})
		.catch((error) => {
			console.log(error)
		})
	}
	handleMouseOverIconLogo = () => {
		this.setState({ styleIconChangeLogo: style.changeImageHover })
	}
	handleMouseOutIconLogo = () => {
		this.setState({ styleIconChangeLogo: style.changeImage })
	}
	handleMouseOverIconCover = () => {
		this.setState({ styleIconChangeCover: style.changeImageHover })
	}
	handleMouseOutIconCover = () => {
		this.setState({ styleIconChangeCover: style.changeImage })
	}
	render() {
		return (
			<Grid className="grid-form stadium-grid">
				<Grid.Row style={style.marginTopBot} centered={true}>
					{
						(this.state.screenSize >= 768)?(
							<Form style={style.styleStadiumForm} loading={this.state.loadingForm} onSubmit={this.handleSubmit} className="format-form stadium-form">
								<Form.Field style={style.positionRelative}>
									<div onMouseOver={this.handleMouseOverIconLogo} onMouseOut={this.handleMouseOutIconLogo} style={this.state.styleIconChangeLogo} onClick={() => this.props.handleTabImage(1)}>
										<Icon name="photo" size="large" />
									</div>
									<label style={style.width30}>Logo sân</label>
									<div style={style.width70}><Image style={style.logoImage} src={this.state.logoImage} fluid /></div>
								</Form.Field>
								<Form.Field style={style.positionRelative}>
									<div onMouseOver={this.handleMouseOverIconCover} onMouseOut={this.handleMouseOutIconCover} style={this.state.styleIconChangeCover} onClick={() => this.props.handleTabImage(2)}>
										<Icon name="photo" size="large" />
									</div>
									<label style={style.width30}>Ảnh nền sân</label>
									<div style={style.width70}><Image style={style.logoImage} src={this.state.bgImage} fluid /></div>
								</Form.Field>
								<span className="err-span">{this.state.errName}</span>
								<Form.Field>
									<label style={style.width30}>Tên</label>
							      	<input style={style.width70} value={this.state.name} name="name" onChange={this.handleChange} />
							    </Form.Field>
								<span className="err-span">{this.state.errAddress}</span>
								<Form.Field>
									<label style={style.width30}>Địa chỉ</label>
							      	<input style={style.width70} value={this.state.address} name="address" onChange={this.handleChange} />
							    </Form.Field>
								<Form.Field>
									<label style={style.width30}>Tỉnh/Thành</label>
									<select style={style.width70} value={this.state.city} onChange={this.handleChangeCity}>
										<option value={0}>Chọn tỉnh/thành</option>
										{
											this.state.cityList.map(x => {
												return (
													<option key={x.id} value={x.id}>{x.name}</option>
												)
											})
										}
									</select>
								</Form.Field>
								<Form.Field>
									<label style={style.width30}>Quận/Huyện</label>
									<select style={style.width70} value={this.state.district} onChange={this.handleChangeDistrict} disabled={this.state.disabled}>
										<option value={0}>Chọn quận/huyện</option>
										{
											this.state.districtList.map(x => {
												return (
													<option key={x.id} value={x.id}>{x.name}</option>
												)
											})
										}
									</select>
								</Form.Field>
								<span className="err-span">{this.state.errManager}</span>
							    <Form.Field>
							    	<Button loading={this.state.loadingBut} className="form-but" type='submit'>Cập nhật</Button>
							    </Form.Field>
						  	</Form>
						):(
							<Form style={style.styleStadiumForm} loading={this.state.loadingForm} onSubmit={this.handleSubmit} className="format-form stadium-form">
								<Form.Field style={style.styleFieldLogoCoverChange}>
									<div onMouseOver={this.handleMouseOverIconLogo} onMouseOut={this.handleMouseOutIconLogo} style={this.state.styleIconChangeLogo} onClick={() => this.props.handleTabImage(1)}>
										<Icon name="photo" size="large" />
									</div>
									<Image style={style.logoImage} src={this.state.logoImage} onClick={() => this.props.handleTabImage(1)} />
								</Form.Field>
								<Form.Field style={style.styleFieldLogoCoverChange}>
									<div onMouseOver={this.handleMouseOverIconCover} onMouseOut={this.handleMouseOutIconCover} style={this.state.styleIconChangeCover} onClick={() => this.props.handleTabImage(2)}>
										<Icon name="photo" size="large" />
									</div>
									<Image style={style.logoImage} src={this.state.bgImage} onClick={() => this.props.handleTabImage(2)} />
								</Form.Field>
								<span className="err-span">{this.state.errName}</span>
								<Form.Field>
							      	<input style={style.width70} value={this.state.name} placeholder="Tên" name="name" onChange={this.handleChange} />
							    </Form.Field>
								<span className="err-span">{this.state.errAddress}</span>
								<Form.Field>
							      	<input style={style.width70} value={this.state.address} placeholder="Địa chỉ" name="address" onChange={this.handleChange} />
							    </Form.Field>
								<Form.Field className="region-select" value={this.state.city} placeholder="Tỉnh/Thành" control="select" onChange={this.handleChangeCity}>
									<option value={0}>Chọn tỉnh/thành</option>
									{
										this.state.cityList.map(x => {
											return (
												<option key={x.id} value={x.id}>{x.name}</option>
											)
										})
									}
								</Form.Field>
								<Form.Field className="region-select" value={this.state.district} placeholder="Quận/Huyện" onChange={this.handleChangeDistrict} control="select" disabled={this.state.disabled}>
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