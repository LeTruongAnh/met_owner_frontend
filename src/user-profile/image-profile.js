import React, { Component } from 'react'
import { Grid, Image, Button, Input, Icon, Loader } from 'semantic-ui-react'
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
				console.log(response.data)
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
		let srcSelect = event.target.src
		if (this.state.srcSelect !== srcSelect)
			this.setState({ srcSelect: srcSelect})
		else
			this.setState({ srcSelect: ""})
	}
	render() {
		return (
			<div>
				<div style={style.styleRowImageButton}>
					{
						(this.props.isImageChange === false)?"":(<Button style={style.styleImageStadiumButton} onClick={
							() => {
								this.props.handleAvatarChange(this.state.srcSelect)
								this.props.handleTabForm()
							}
						}>Chọn</Button>)
					}
					<Input style={style.displayNone} id="input-image" ref={this.textInput} onChange={ (e) => this.handleAddImage(e.target.files)} type="file" />
				</div>
				<Grid style={{margin: "0"}} columns={(this.state.screenSize >= 768)?6:2}>
					<Loader active={this.state.loading} />
					<Grid.Column onClick={this.handleClickAddImage}>
						<Button style={style.fullWidthHeight}>
							<Icon name="add" size={(this.state.screenSize > 1024)?("large"):("small")}/>
						</Button>
					</Grid.Column>
					{
						this.state.imageList.map((x, index) => {
							return (
								<Grid.Column className="hover-image-stadium" style={(x === this.state.srcSelect)?style.styleImageStadiumSelect:style.styleImageStadium} key={index}>
									<Image onClick={this.handleClickImage} src={x} />
								</Grid.Column>
							)
						})
					}
				</Grid>
			</div>
		)
	}
}

export default StadiumImage