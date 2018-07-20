import React, { Component } from 'react'
import { Grid, Select, Label, Input, Form, TextArea, Segment, Checkbox, Button } from 'semantic-ui-react'
import style from '../dashboard/style.js'

class BookingOnce extends Component {
	constructor(props) {
		super(props)
		this.state = {
			screenSize: window.screen.width,
			loading: true,
			typeStadiumText: "Nguyên sân",
			typeStadium: 1,
			err: ""
		}
	}
	componentDidMount = () => {
		this.setState({ loading: false })
		window.addEventListener('resize',this.detectScreenChange)
	}
	detectScreenChange = () => {
		this.setState({ screenSize: window.screen.width })
	}
	handleChangeDefaulStadium = (event, object) => {
		for (let i = 0; i < object.options.length; i++) {
			if (object.value === object.options[i].value) {
				this.setState({ typeStadiumText: object.options[i].text})
				break
			}
		}
	}
	changeTypeStadium = (e) => {
		this.setState({typeStadium: e.target.value})
	}
	render() {
		const typeStadium = [
			{
				value: 0,
				text: "Nguyên sân"
			},
			{
				value: 1,
				text: "Cáp kèo"
			}
		]
		return (
			<Form style={style.fullWidth} onSubmit={this.handleOnSubmit}>
				<Grid style={style.margin0} columns={2} divided>
					<Grid.Column width={10}>
						<Grid columns={2}>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Loại sân</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Trạng thái đặt</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Sân bóng</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Sân con</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Đối tượng đặt sân</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Đội bóng</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Đối tượng đặt sân thứ 2</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Đội bóng thứ 2</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<span className="err-span">{this.state.err}</span>
								<div style={style.styleLabelDiv}><label>Ngày đặt</label></div>
								<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
								{
									typeStadium.map(x => {
										return (<option key={x.value} value={x.value}>{x.text}</option>)
									})
								}
								</select>
							</Grid.Column>
							<Grid.Column width={8}>
								<Grid columns={2}>
									<Grid.Column width={8}>
										<span className="err-span">{this.state.err}</span>
										<div style={style.styleLabelDiv}><label>Giờ bắt đầu</label></div>
										<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
										{
											typeStadium.map(x => {
												return (<option key={x.value} value={x.value}>{x.text}</option>)
											})
										}
										</select>
									</Grid.Column>
									<Grid.Column width={8}>
										<span className="err-span">{this.state.err}</span>
										<div style={style.styleLabelDiv}><label>Giờ kết thúc</label></div>
										<select style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue}>
										{
											typeStadium.map(x => {
												return (<option key={x.value} value={x.value}>{x.text}</option>)
											})
										}
										</select>
									</Grid.Column>
								</Grid>
							</Grid.Column>
						</Grid>
					</Grid.Column>
					<Grid.Column width={6}>
						<span className="err-span">{this.state.err}</span>
						<div style={style.styleLabelDiv}><label>Điện thoại liên hệ</label></div>
						<Input style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue} />
						<div style={style.styleLabelDiv}><label>Ghi chú</label></div>
						<TextArea style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue} />
						<Segment>
							<div>Thứ năm....</div>
							<div>
								<div style={style.styleLabelDiv}><label>Tiền sân</label></div>
								<Input style={style.fullWidth} value={this.state.textVAlue} onChange={this.changeTextVAlue} />
								<Checkbox label="Đã thanh toán" />
							</div>
							<div>
								<Button onClick={this.handleOnSubmit}>Đặt sân</Button>
							</div>
						</Segment>
					</Grid.Column>
				</Grid>
			</Form>
		)
	}
}

export default BookingOnce