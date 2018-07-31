import React, {Component} from 'react'
import { Table, Segment } from 'semantic-ui-react'

class BookingHistoryDetail extends Component {
	handleTimeString = (date_created) => {
        let today = new Date(date_created)
        let months = ['01','02','03','04','05','06','07','08','09','10','11','12']
        let days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
        let year = today.getFullYear()
        let month = months[today.getMonth()]
        let date = (today.getDate() < 10)?("0" + today.getDate()):today.getDate()
        let day = days[today.getDay()]
        let hour = today.getHours()
        let min = today.getMinutes()
        let second = today.getSeconds()
        let time = day + ", " + date + "/" + month + "/" + year + ", " + hour + ":" + min + ":" + second
        return time
    }
	render() {
		if (this.props.lst)
			return (
				<Table celled striped unstackable={true}>
		            <Table.Header>
		                <Table.Row>
		                    <Table.HeaderCell>Thời gian</Table.HeaderCell>
		                    <Table.HeaderCell>Số tiền</Table.HeaderCell>
		                </Table.Row>
		            </Table.Header>
		            <Table.Body>
		            {
		                this.props.lst.map((x, index1) => {
		                    return (
		                        <Table.Row key={index1}>
		                            <Table.Cell>{this.handleTimeString(x.date_created)}</Table.Cell>
		                            <Table.Cell>{x.amount}</Table.Cell>
		                        </Table.Row>
		                    )
		                })
		            }
		            </Table.Body>
		        </Table>
			)
		else return (<Segment style={{color: "#000"}}>Không có lịch sử thanh toán</Segment>)
	}
}

export default BookingHistoryDetail