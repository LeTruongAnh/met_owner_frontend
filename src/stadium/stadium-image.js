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
			imageList: [],
			srcSelect: "",
			loading: true
		}
	}
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
		if (this.state.userInfo) {
			axios.get(`${config.apiBaseURL}/api/stadium/` + this.state.userInfo.default_stadium_id, {
				'headers': {'Authorization': this.state.userInfo.token}
			})
			.then((response) => {
				this.setState({
					imageList: response.data.imageList,
					loading: false
				})
			})
			.catch(function (error) {
				console.log(error)
				this.setState({
					loading: false
				})
			})
		}
	}
	handleClickAddImage = () => {
		document.getElementById('input-image').click()
	}
	handleAddImage = (selectorFiles: FileList) => {
		var file = selectorFiles[0];
		var reader = new FileReader();
		this.setState( {loading: true} )
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
				let lst = [...this.state.imageList, response.data.url]
				this.setState({
					imageList: lst,
					loading: false
				})
			})
			.catch((error) => {
				console.log(error.response)
				this.setState( {loading: true} )
			})
		}
		reader.readAsDataURL(file);
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
						(this.props.numberImageChange === 0)?"":(<Button style={style.styleImageStadiumButton} onClick={
							() => {
								let url = this.state.srcSelect
								if (this.props.numberImageChange === 1) this.props.handleImageChange(url) 
								else this.props.handleBgImageChange(url)
								this.props.handleTabForm()
							}
						}>Chọn</Button>)
					}
					<Input style={style.displayNone} id="input-image" ref={this.textInput} onChange={ (e) => this.handleAddImage(e.target.files)} type="file" />
					<Button style={style.styleImageStadiumButton} onClick={this.handleClickAddImage}><Icon name="add" size="small"></Icon></Button>
				</div>
				<Grid style={{margin: "0"}} columns={(this.state.screenSize >= 768)?6:2}>
					<Loader active={this.state.loading} />
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