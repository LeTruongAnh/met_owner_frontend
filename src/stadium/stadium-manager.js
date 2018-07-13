import React, { Component } from 'react'
import { Grid, Table, Button } from 'semantic-ui-react'
import style from '../dashboard/style.js'

class StadiumManager extends Component {
	constructor(props) {
		super(props)
		this.state = {
			managerList: props.managerList
		}
	}

	render() {
		return (
			<Grid>
				<Grid.Row style={style.marginTopBot}>
					<Button>Thêm quản lý</Button>
				</Grid.Row>
				<Grid.Row>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>STT</Table.HeaderCell>
								<Table.HeaderCell>Tên</Table.HeaderCell>
								<Table.HeaderCell>Số điện thoại</Table.HeaderCell>
								<Table.HeaderCell>Vai trò</Table.HeaderCell>
								<Table.HeaderCell>Chi tiết</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell>A</Table.Cell>
								<Table.Cell>B</Table.Cell>
								<Table.Cell>C</Table.Cell>
								<Table.Cell>D</Table.Cell>
								<Table.Cell style={style.flexCenter}>
									<Button>Detail</Button>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
						<Table.Footer>
							<Table.Row>
								
							</Table.Row>
						</Table.Footer>
					</Table>
				</Grid.Row>
			</Grid>
		)
	}
}

export default StadiumManager