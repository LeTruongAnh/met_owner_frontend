import React, { Component } from 'react'
import { Form, Grid, Segment, Button, Message } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config.js'
import style from '../dashboard/style.js'
import CountDownTime from './count-down-time'

class BookingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
            bookingInfo: [],
            creator: [],
            loading: true,
            approved: false,
            canceled: false
        }
    }
    componentDidMount = () => {
        axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}`, {
            'headers': {'Authorization': this.state.userInfo.token}
        })
        .then((response) => {
            this.setState({ 
                bookingInfo: response.data,
                creator: response.data.creator
            }, () => this.setState({ loading: false }))
        })
        .catch((error) => {
            console.log(error.response)
        })
    }
    timeConverter = (timeStart, timeEnd) => {
        var a = new Date(timeStart)
        var b = new Date(timeEnd)
        var hourStart = (a.getHours() < 10)?("0" + a.getHours()):a.getHours()
        var minStart = (a.getMinutes() < 10)?("0" + a.getMinutes()):a.getMinutes()
        var hourEnd = (b.getHours() < 10)?("0" + b.getHours()):b.getHours()
        var minEnd = (b.getMinutes() < 10)?("0" + b.getMinutes()):b.getMinutes()
        var time = hourStart + ":" + minStart + " - " + hourEnd + ":" + minEnd
        return time
    }
    dateConverter = (UNIX_timestamp) => {
        var a = new Date(UNIX_timestamp)
        var months = ['01','02','03','04','05','06','07','08','09','10','11','12']
        var year = a.getFullYear()
        var month = months[a.getMonth()]
        var date = (a.getDate() < 10)?("0" + a.getDate()):a.getDate()
        var time = date + "/" + month + "/" + year
        return time
    }
    handleAccept = () => {
        axios.post(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/approve`, {} ,{
            'headers': {
                'Authorization': this.state.userInfo.token,
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
            this.setState({ approved: true })
        })
        .catch((error) => {
            console.log(error.response)
        })
    }
    handleCancel = () => {
        axios.post(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/reject`, {} ,{
            'headers': {
                'Authorization': this.state.userInfo.token,
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
            this.setState({ canceled: true })
            console.log(response)
        })
        .catch((error) => {
            console.log(error.response)
        })
    }
    render() {
        return (
            <Grid style={style.marginTotal0px} className="stadium-grid">
                <Grid.Row><h3 style={style.marginTotal14px}>Thông tin đặt sân</h3></Grid.Row>
                <Grid.Row centered={true}>
                    <Segment>
                        <Form loading={this.state.loading} className="format-form stadium-form">
                            <Form.Field>
                                <label className="booking-detail-label">Mã đặt sân</label>
                                <Form.Input className="booking-detail-input">{this.state.bookingInfo.id}</Form.Input>
                            </Form.Field>
                            <Form.Field>
                                <label className="booking-detail-label">Số điện thoại</label>
                                <Form.Input className="booking-detail-input">{this.state.creator.country_code + this.state.creator.phone}</Form.Input>
                            </Form.Field>
                            <Form.Field>
                                <label className="booking-detail-label">Sân con</label>
                                <Form.Input className="booking-detail-input">{this.state.bookingInfo.sc_name}</Form.Input>
                            </Form.Field>
                            <Form.Field>
                                <label className="booking-detail-label">Ngày đá</label>
                                <Form.Input className="booking-detail-input">{this.dateConverter(this.state.bookingInfo.date_started)}</Form.Input>
                            </Form.Field>
                            <Form.Field>
                                <label className="booking-detail-label">Giờ đá</label>
                                <Form.Input className="booking-detail-input">{this.timeConverter(this.state.bookingInfo.date_started,this.state.bookingInfo.date_ended)}</Form.Input>
                            </Form.Field>
                            <Form.Field>
                                <label className="booking-detail-label">Trạng thái</label>
                                <Form.Input className="booking-detail-input" style={(() => {
                                                        switch(this.state.bookingInfo.status) {
                                                            case 1:
                                                                return style.pendingColor
                                                            case 2:
                                                            case 7:
                                                                return style.approvedColor
                                                            case 3:
                                                                return style.paymentCompletedColor
                                                            default:
                                                                return style.errorColor
                                                        }
                                                    })()}>
                                    {(() => {
                                        switch(this.state.bookingInfo.status) {
                                            case 1:
                                                return "Chờ duyệt"
                                            case 2:
                                                return "Đã được duyệt"
                                            case 3:
                                                return "Đã thanh toán"
                                            case 4:
                                                return "Lỗi thanh toán"
                                            case 5:
                                                return "Đã từ chối"
                                            case 6:
                                                return "Đã hủy"
                                            case 7:
                                                return "Đã đặt cọc"
                                            default:
                                                return "" 
                                        }
                                    })()}
                                </Form.Input>
                            </Form.Field>
                        </Form>
                        {(() => {
                            if (this.state.approved) 
                                return <Message style={style.colorMassageAccept} floating>Bạn đã duyệt thành công!</Message>
                            else if (this.state.canceled)
                                return <Message style={style.colorMassageCancel} floating>Đặt sân đã bị hủy!</Message>
                            else {
                                console.log(this.state.bookingInfo.status)
                                return
                                    (this.state.bookingInfo.status === 1)?(
                                        <Grid columns={3} centered={true}>
                                            <Grid.Column style={style.flexCenter}><Button style={style.colorButtonAccept} onClick={this.handleAccept}>Duyệt</Button></Grid.Column>
                                            <Grid.Column style={style.flexCenter}>{}<CountDownTime handleCancel={() => this.handleCancel} /></Grid.Column>
                                            <Grid.Column style={style.flexCenter}><Button style={style.colorButtonCancel} onClick={this.handleCancel}>Hủy</Button></Grid.Column>
                                        </Grid>
                                    ):""
                                }
                        })()}
                    </Segment>
                </Grid.Row>
                
            </Grid>
        )
    }
}

export default BookingForm;