import React, { Component } from 'react'
import { Header, Table, Grid, Menu, Icon } from 'semantic-ui-react'
import style from '../dashboard/style.js'
import axios from 'axios'
import config from '../config'

class BookingInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			bookingList: []
		}
	}
	componentDidMount = () => {
		axios.get(`${config}/api/booking/list?page=1&limit=0&date=1528218000000`)
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error.response)
			console.log("fail")
		})
	}
	render() {
		return (
			<Grid>
				<Header style={style.marginTopBot} as="h1">Danh sách đặt sân</Header>
				<Table style={style.marginTable} celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>STT</Table.HeaderCell>
							<Table.HeaderCell>Tên sân</Table.HeaderCell>
							<Table.HeaderCell>Sân con</Table.HeaderCell>
							<Table.HeaderCell>Giờ đá</Table.HeaderCell>
							<Table.HeaderCell>Trạng thái</Table.HeaderCell>
							<Table.HeaderCell>Link</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						<Table.Row>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
						</Table.Row>
					</Table.Body>

					<Table.Footer>
						<Table.Row>
							<Table.HeaderCell colSpan='6'>
								<Menu floated='right' pagination>
									<Menu.Item as='a' icon>
										<Icon name='chevron left' />
									</Menu.Item>
									<Menu.Item as='a'>1</Menu.Item>
									<Menu.Item as='a'>2</Menu.Item>
									<Menu.Item as='a'>3</Menu.Item>
									<Menu.Item as='a'>4</Menu.Item>
									<Menu.Item as='a' icon>
									<Icon name='chevron right' />
									</Menu.Item>
								</Menu>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
				</Table>
			</Grid>
		)
	}
}

export default BookingInfo;