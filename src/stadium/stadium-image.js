import React, { Component } from 'react'
import { Grid, Image, Button, Icon, Loader } from 'semantic-ui-react'
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
				console.log(error)
				this.setState( {loading: false} )
			})
		}
		reader.readAsDataURL(file);
	}
	handleClickImage = (event) => {
		console.log(event.target.getAttribute('link'))
		let srcSelect = event.target.getAttribute('link')
		if (this.state.srcSelect !== srcSelect)
			this.setState({ srcSelect: srcSelect})
		else
			this.setState({ srcSelect: ""})
	}
	detectScreenChange = () => {
		this.setState({ screenSize: window.screen.width })
	}
	render() {
		return (
			<div>
				<div style={{height: "150px", width: "150px", margin: "14px", padding: 0, float: "left"}} onClick={this.handleClickAddImage}>
					<Button style={style.fullWidthHeight}>
						<Icon name="add" size={(this.state.screenSize > 1024)?("large"):("small")}/>
					</Button>
				</div>
				{
					this.state.imageList.map((x, index) => {
						let styleImageStadium = Object.assign({}, style.styleImageStadium)
						styleImageStadium.backgroundImage = `url('${x}')`
						let styleImageStadiumSelect = Object.assign({}, styleImageStadium)
						styleImageStadiumSelect.border = "2px outset #006838"
						return (
							<div link={x} className="hover-image-stadium" onClick={this.handleClickImage}
								style={(x === this.state.srcSelect)?styleImageStadiumSelect:styleImageStadium} key={index}>
							</div>
						)
					})
				}
			</div>
		)
	}
}

export default StadiumImage