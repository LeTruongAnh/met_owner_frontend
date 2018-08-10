import React, { Component } from 'react'
import { Grid, Button, Icon, Loader, Modal, Image } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'
import style from '../dashboard/style.js'

class StadiumImage extends Component {
	constructor(props) {
		super(props)
		this.textInput = React.createRef()
		this.state = {
			screenSize: window.innerWidth,
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
			imageList: [],
			srcSelect: "",
			loading: true,
			errAddImage: ""
		}
	}
	componentDidMount = () => {
		axios.get(`${config.apiBaseURL}/api/stadium/pictures?stadiumID=${this.state.userInfo.default_stadium_id}`)
		.then(response => {
			let imageList = response.data.filter(x => x.includes("_thumbnail.jpg"))
			this.setState({
				imageList: imageList,
				loading: false
			})
		})
		.catch(error => {
			console.log(error)
			this.setState({ loading: false })
		})
		window.addEventListener('resize', this.detectScreenChange)
	}
	handleClickAddImage = () => {
		document.getElementById('input-image').click()
	}
	handleAddImage = (selectorFiles) => {
		this.setState({
			errAddImage: ""
		})
		if (selectorFiles.length > 0) {
			if (selectorFiles[0].name.endsWith(".gif") || selectorFiles[0].name.endsWith(".jpg") || selectorFiles[0].name.endsWith(".jpeg") || selectorFiles[0].name.endsWith(".tiff") || selectorFiles[0].name.endsWith(".png")) {
				this.setState({
					errAddImage: ""
				})
				this.setState( {loading: true} )
				var file = selectorFiles[0]
				var reader = new FileReader()
				reader.onloadend = () => {
					axios.post(`${config.apiBaseURL}/api/stadium/upload`, {
						"image": reader.result,
						"stadiumID": this.state.userInfo.default_stadium_id
					}, {
						'headers': {
							'Authorization': this.state.userInfo.token,
							'Content-Type': 'application/json'
						}
					})
					.then((response) => {
						console.log(response.data)
						let lst = [...this.state.imageList, response.data.url]
						this.setState({
							imageList: lst,
							loading: false,
							errAddImage: ""
						})
					})
					.catch((error) => {
						console.log(error)
						this.setState( {loading: false} )
					})
				}
				reader.readAsDataURL(file)
			}
			else this.setState({
				errAddImage: "*Vui lòng chọn tệp hình ảnh!"
			})
		}
	}
	handleClickImage = (event) => {
		let srcSelect = event.target.getAttribute('link')
		if (this.state.srcSelect !== srcSelect)
			this.setState({ srcSelect: srcSelect})
		else
			this.setState({ srcSelect: ""})
	}
	detectScreenChange = () => {
		this.setState({
			screenSize: window.innerWidth
		})
	}
	render() {
		return (
			<Grid>
				<Loader active={this.state.loading} />
				<span className="err-span">{this.state.errAddImage}</span>
				<Grid.Row>
					{
						(this.props.numberImageChange === 0)?"":(<Button disabled={(this.state.srcSelect !== "")?false:true} style={style.styleImageStadiumButton} onClick={
							() => {
								if (this.props.numberImageChange === 1) this.props.handleImageChange(this.state.srcSelect)
								else this.props.handleBgImageChange(this.state.srcSelect)
								this.props.handleTabForm()
							}
						}>Chọn</Button>)
					}
					<input style={style.displayNone} id="input-image" ref={this.textInput} onChange={ (e) => this.handleAddImage(e.target.files)} type="file" />
				</Grid.Row>
				<Grid.Row columns={(this.state.screenSize >= 768)?6:2}>
					<Grid.Column style={{paddingBottom: "14px"}} onClick={this.handleClickAddImage}>
						<div style={style.fullWidthHeight}>
							<Button style={style.fullWidthHeight}>
								<Icon name="add" size="large"/>
							</Button>
						</div>
					</Grid.Column>
					{
						this.state.imageList.map((x, index) => {
							let styleImageStadium = Object.assign({}, style.styleImageStadium)
							let styleCol = {
								marginBottom: "14px",
								height: "auto",
								position: "relative"
							}
							if (this.state.screenSize > 1024)
								if (localStorage.getItem("isExpand") === "true") styleCol.height = "calc(((81.25vw - 56px) / 6) - 28px)"
								else styleCol.height = "calc(((93.75vw - 56px) / 6) - 28px)"
							else if (this.state.screenSize >= 768)
								if (localStorage.getItem("isExpand") === "true") styleCol.height = "calc(((75vw - 56px) / 6) - 28px)"
								else styleCol.height = "calc(((87.5vw - 56px) / 6) - 28px)"
							else styleCol.height = "calc(((100vw - 28px) / 2) - 28px)"
							styleImageStadium.backgroundImage = `url('${x}')`
							if (this.props.numberImageChange === 0) {
								styleImageStadium.cursor = "pointer"
								return (
									<Grid.Column style={styleCol} key={index}>
										<Modal centered={false} closeIcon={true} trigger={
												<div link={x} style={styleImageStadium}></div>
											}>
											<Modal.Content>
												<Image style={style.marginAuto} src={x} />
											</Modal.Content>
										</Modal>
									</Grid.Column>
								)
							}
							else {
								let styleImageStadiumSelect = Object.assign({}, styleImageStadium)
								styleImageStadiumSelect.border = `2px solid #006838`
								return (
									<Grid.Column style={styleCol} key={index}>
										<Modal centered={false} closeIcon={true} trigger={
												<div style={style.styleExternalIconDivRT}>
													<Icon style={style.detailLink} size="small" name="external"/>
												</div>
											}>
											<Modal.Content>
												<Image style={style.marginAuto} src={x} />
											</Modal.Content>
										</Modal>
										<div link={x} onClick={this.handleClickImage}
										style={(x === this.state.srcSelect)?styleImageStadiumSelect:styleImageStadium}></div>
									</Grid.Column>
								)
							}
						})
					}
				</Grid.Row>
			</Grid>
		)
	}
}

export default StadiumImage