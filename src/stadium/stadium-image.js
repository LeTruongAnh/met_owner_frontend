import React, { Component } from 'react'
import { Grid, Image, Button, Icon, Input } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'

class StadiumImage extends Component {
	constructor(props) {
		super(props)
		this.textInput = React.createRef()
		this.state = {
			screenSize: window.screen.width,
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
			imagelist: []
		}
	}
	componentDidMount = () => {
		window.addEventListener('resize', this.detectScreenChange)
		if (this.state.userInfo) {
			axios.get(`${config.apiBaseURL}/api/stadium/` + this.state.userInfo.default_stadium_id, {
				'headers': {'Authorization': this.state.userInfo.token}
			})
			.then((response) => {
				this.setState({ imagelist: response.data.imagelist })
			})
			.catch(function (error) {
				console.log(error);
			})
		}
	}
	focusTextInput = () => {
		document.getElementById('input-image').click()
	}
	render() {
		return (
			<Grid>
				<Grid.Row columns={(this.state.screenSize >= 768)?4:2}>
				{
					this.state.imagelist.map((x, index) => {
						return (
							<Grid.Column key={index}>
								<Image src={x} />
							</Grid.Column>
						)
					})
				}
					<Grid.Column className="add-image-button">
						<Input id="input-image" ref={this.textInput} type="file" />
						<Button onClick={this.focusTextInput}>
							<Icon name="add" size="big"/>
						</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}

export default StadiumImage;