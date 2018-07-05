import React, { Component } from 'react'
import { Grid, Image, Button, Input, Loader } from 'semantic-ui-react'
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
			imagelist: [],
			loading: false,
			srcSelect: ""
		}
	}
	componentDidMount = () => {
		this.setState({ loading: true })
		window.addEventListener('resize', this.detectScreenChange)
		if (this.state.userInfo) {
			axios.get(`${config.apiBaseURL}/api/stadium/` + this.state.userInfo.default_stadium_id, {
				'headers': {'Authorization': this.state.userInfo.token}
			})
			.then((response) => {
				this.setState({
					imagelist: response.data.imagelist,
					loading: false
				})
			})
			.catch(function (error) {
				console.log(error);
			})
		}
	}
	handleAddImage = () => {
		document.getElementById('input-image').click()
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
						(this.props.content)?(
							<div>
								<Button style={style.styleImageStadiumButton} onClick={this.props.handleChooseImage}>Chọn</Button>
								<Button style={style.styleImageStadiumButton} onClick={this.props.handleCloseModal}>Hủy</Button>
							</div>
						):""
					}
					<Input style={style.displayNone} id="input-image" ref={this.textInput} type="file" />
					<Button style={style.styleImageStadiumButton} onClick={this.handleAddImage}>Thêm ảnh</Button>
				</div>
				<Grid style={{margin: "0"}} columns={(this.state.screenSize >= 768)?4:2}>
					<Loader active={this.state.loading} />
					{
						this.state.imagelist.map((x, index) => {
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

export default StadiumImage;