import React, { Component } from 'react'
import { Grid, Table, Loader, Button } from 'semantic-ui-react'
import config from '../config.js'
import axios from 'axios'

class ListStadium extends Component {
	constructor(props) {
		super(props)
		console.log(props.stadiumList)
		this.state = {
			token: JSON.parse(localStorage.getItem('MET_userInfo')).token,
			stadiumList: props.stadiumList,
			loading: true
		}
	}
	componentDidMount = () => {
		this.setState({ loading: false })
	}
	handleChooseDefaultStadium = (number) => {
		this.setState({ loading: true })
		axios.put(`${config.apiBaseURL}/api/user/profile`, {
			"default_stadium_id": number
		}, {
			'headers': {
				'Authorization': this.state.token,
				'Content-Type': 'application/json'
			}
		})
		.then((reponse) => {
			console.log(reponse.data)
			axios.get(`${config.apiBaseURL}/api/stadium/list?page=1&limit=10`, {
	            'headers': {'Authorization': this.state.token}
	        })
	        .then((response) => {
	            this.setState({
	                stadiumList: response.data.items,
	                loading: false
	            })
	        })
	        .catch((error) => {
	            console.log(error)
	            this.setState({ loading: false })
	        })
		})
		.catch((error) => {
			console.log(error)
			this.setState({ loading: false })
		})
	}
	render() {
		return (
			<Grid>
				<Grid.Row>
					<Table celled striped unstackable={true}>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>STT</Table.HeaderCell>
								<Table.HeaderCell>Tên sân</Table.HeaderCell>
								<Table.HeaderCell>Chọn sân mặc định</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{
							this.state.stadiumList.map((x, index) => {
								return (
									<Table.Row key={index}>
										<Table.Cell>{x.id}</Table.Cell>
										<Table.Cell>{x.name}</Table.Cell>
										<Table.Cell style={{display: "flex", justifyContent: "center"}}>
											<Button onClick={() => this.handleChooseDefaultStadium(x.id)}>
												Chọn
											</Button>
										</Table.Cell>
									</Table.Row>
								)
							})
						}
						</Table.Body>
					</Table>
				</Grid.Row>
				<Loader active={this.state.loading} />
			</Grid>
		)
	}
}

export default ListStadium