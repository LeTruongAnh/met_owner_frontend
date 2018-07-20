import React, { Component } from 'react'
import { Grid, Table, Loader } from 'semantic-ui-react'
import style from '../dashboard/style.js'

class StadiumChild extends Component {
	constructor(props) {
		super(props)
		this.state = {
			stadiumChild: props.stadiumChild,
			loading: true
		}
	}
	componentDidMount = () => {
		this.setState({ loading: false })
    }
	handleTypeStadiumChild = (number) => {
		switch (number) {
			case 1:
				return "Sân cỏ nhân tạo 5 người"
			case 3:
				return "Sân trong nhà 5 người"
			case 5:
				return "Sân cỏ nhân tạo 7 người"
			case 7:
				return "Sân cỏ 11 người"
			case 9:
				return "Sân ghép 11 người"
			case 11:
				return "Sân cỏ nhân tạo 6 người"
			default:
				return "Sân bóng"
		}
	}
	handleMergeList = (lst) => {
		let rs = ""
		if (lst.length > 0) {
			for (let i = 0; i < lst.length; i++) {
				for (let j = 0; j < this.state.stadiumChild.length; j++) {
					if (lst[i] === this.state.stadiumChild[j].id) {
						if (i === (lst.length - 1)) {
							rs += this.state.stadiumChild[j].name
						}
						else {
							rs = this.state.stadiumChild[j].name + ", " + rs
						}
					}
				}
			}
		}
		else rs = "Có"
		return rs
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
								<Table.HeaderCell>Tình trạng</Table.HeaderCell>
								<Table.HeaderCell>Loại sân</Table.HeaderCell>
								<Table.HeaderCell textAlign="center">Ghép sân</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
						{
							this.state.stadiumChild.map((x, index) => {
								return (
									<Table.Row key={index}>
										<Table.Cell>{x.id}</Table.Cell>
										<Table.Cell>{x.name}</Table.Cell>
										{
											(x.status === 1)?(
												<Table.Cell style={style.approvedColor}>Hoạt động</Table.Cell>
											):(
												<Table.Cell style={style.errorColor}>Khóa</Table.Cell>
											)
										}
										<Table.Cell>{this.handleTypeStadiumChild(x.type)}</Table.Cell>
										<Table.Cell textAlign="center">{(!x.is_merge)?"Không":(this.handleMergeList(x.merge_list))}</Table.Cell>
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

export default StadiumChild