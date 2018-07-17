import React, { Component } from 'react'
import { Grid, Button, Icon, Loader } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'
import style from '../dashboard/style.js'

class StadiumImage extends Component {
	constructor(props) {
		super(props)
		this.textInput = React.createRef()
		this.state = {
			screenSize: window.screen.width,
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
			imageList: props.imageList || [],
			srcSelect: "",
			loading: true
		}
	}
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
		this.setState({loading:false})
	}
	handleClickAddImage = () => {
		document.getElementById('input-image').click()
	}
	handleAddImage = (selectorFiles) => {
		var file = selectorFiles[0];
		var reader = new FileReader();
		this.setState( {loading: true} )
		reader.onloadend = () => {
			axios.post(`${config.apiBaseURL}/api/user/upload`, {
				"image": reader.result,
				"stadiumID": this.state.userInfo.default_stadium_id
			}, {
				'headers': {
					'Authorization': this.state.userInfo.token,
					'Content-Type': 'application/json'
				}
			})
			.then((response) => {
				let lst = [...this.state.imageList, response.data.url]
				this.setState({
					imageList: lst,
					loading: false
				})
			})
			.catch((error) => {
				console.log(error)
				this.setState( {loading: true} )
			})
		}
		reader.readAsDataURL(file)
	}
	handleClickImage = (event) => {
		let srcSelect = event.target.getAttribute('link')
		if (this.state.srcSelect !== srcSelect)
			this.setState({ srcSelect: srcSelect})
		else
			this.setState({ srcSelect: ""})
	}
	render() {
		return (
			<Grid>
				<Loader active={this.state.loading} />
				<Grid.Row>
					{
						(this.props.isImageChange === false)?"":(<Button style={style.styleImageStadiumButton} onClick={
							() => {
								this.props.handleAvatarChange(this.state.srcSelect)
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
								<Icon name="add" size={(this.state.screenSize > 1024)?("large"):("small")}/>
							</Button>
						</div>
					</Grid.Column>
					{
						this.state.imageList.map((x, index) => {
							let styleImageStadium = Object.assign({}, style.styleImageStadium)
							let styleCol = {
								marginBottom: "14px",
								height: "auto"
							}
							if (this.state.screenSize > 1024)
								if (localStorage.getItem("isExpand") === "true") styleCol.height = "calc((81.25vw - 224px) / 6)"
								else styleCol.height = "calc((93.7vw - 224px) / 6)"
							else if (this.state.screenSize >= 768)
								if (localStorage.getItem("isExpand") === "true") styleCol.height = "calc((75vw - 224px) / 6)"
								else styleCol.height = "calc((87.5vw - 224px) / 6)"
							else styleCol.height = "calc((100vw - 84px) / 2)"
							styleImageStadium.backgroundImage = `url('${x}')`
							let styleImageStadiumSelect = Object.assign({}, styleImageStadium)
							styleImageStadiumSelect.border = `2px solid #006838`
							return (
								<Grid.Column style={styleCol} key={index}>
									<div link={x} className="hover-image-stadium" onClick={this.handleClickImage}
									style={(x === this.state.srcSelect)?styleImageStadiumSelect:styleImageStadium}></div>
								</Grid.Column>
							)
						})
					}
				</Grid.Row>
			</Grid>
		)
	}
}

export default StadiumImage