import React, { Component } from 'react'
import { Form, Grid, Segment, Button, Message, Breadcrumb, Table, Modal, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../config.js'
import style from '../dashboard/style.js'
import CountDownTime from './count-down-time'

class BookingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screenSize: window.innerWidth,
            token: (localStorage.getItem('MET_userInfo'))?JSON.parse(localStorage.getItem('MET_userInfo')).token:"",
            bookingInfo: [],
            bookingHistoryPayment: [],
            creator: {},
            loading: true,
            approved: false,
            canceled: false,
            loadingPayment: true,
            loadingBookingDetail: true,
            note: "",
            amount: 0,
            errAmount: "",
            loadingBut: false,
            openModal: false
        }
    }
    componentDidMount = () => {
        window.addEventListener('resize',this.detectScreenChange)
        axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/payment`, {
            'headers': {'Authorization': this.state.token}
        })
        .then((response) => {
            this.setState({ 
                bookingHistoryPayment: response.data.items,
                loadingPayment: false
            }, () => {
                if (!this.state.loadingPayment && !this.state.loadingBookingDetail)    
                    this.setState({ loading: false })
            })
        })
        .catch((error) => {
            console.log(error)
        })
        axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}`, {
            'headers': {'Authorization': this.state.token}
        })
        .then((response) => {
            this.setState({ 
                bookingInfo: response.data,
                creator: response.data.creator,
                loadingBookingDetail: false
            }, () => {
                if (!this.state.loadingPayment && !this.state.loadingBookingDetail)    
                    this.setState({ loading: false })
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    detectScreenChange = () => {
        this.setState({ screenSize: window.innerWidth })
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
        axios.post(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/approve`, {}, {
            'headers': {
                'Authorization': this.state.token,
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
            this.setState({ approved: true })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    handleCancel = () => {
        axios.post(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/reject`, {}, {
            'headers': {
                'Authorization': this.state.token,
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
            this.setState({ canceled: true })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    renderButton = () => {
        if (this.state.bookingInfo.status !== 1)
            return
        else if (this.state.bookingInfo.remain_time <= 0)
            return <Message style={style.colorMassageCancel} floating>Đã quá hạn!</Message>
        else if (this.state.approved) 
            return <Message style={style.colorMassageAccept} floating>Bạn đã duyệt thành công!</Message>
        else if (this.state.canceled)
            return <Message style={style.colorMassageCancel} floating>Đặt sân đã bị hủy!</Message>
        else {
            return (
                <Grid columns={3} centered={true}>
                    <Grid.Column style={style.flexCenter}><Button style={style.colorButtonAccept} onClick={this.handleAccept}>Duyệt</Button></Grid.Column>
                    <Grid.Column style={style.flexCenter}><CountDownTime time={parseInt(this.state.bookingInfo.remain_time / 1000, 10)} handleCancel={this.handleCancel} /></Grid.Column>
                    <Grid.Column style={style.flexCenter}><Button style={style.colorButtonCancel} onClick={this.handleCancel}>Hủy</Button></Grid.Column>
                </Grid>
            )
        }
    }
    handleStyleBookingStatus = () => {
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
    }
    handleBookingStatus = (temp) => {
        switch(temp) {
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
    }
    handleBookingMoney = (num) => {
        let moneyString = ""
        while (num >= 1000) {
            let surplus = num % 1000
            moneyString = (surplus >= 100)?`.${surplus}`:((surplus >= 10)?`.0${surplus}`:`.00${surplus}`) + moneyString
            num = num / 1000
        }
        return moneyString = `${num}` + moneyString
    }
    handleChange = (e) => this.setState({[e.target.name]: e.target.value})
    handleCheckAmount = () => {}
    handlePay = () => {
        this.setState({ openModal: true })
    }
    handleSubmit = () => {
        this.setState({ loadingBut: true })
        let isOK = true
        if (this.state.amount === "") {
            this.setState({ errAmount: "Nhập số tiền thanh toán"})
            isOK = false
        }
        else {
            this.setState({ errAmount: ""})
        }
        if (isOK) {
            if (this.state.bookingHistoryPayment.length > 0) {
                axios.put(`${config.apiBaseURL}/api/booking/payment/${this.state.bookingHistoryPayment[0].id}`, {
                    "note": this.state.note,
                    "amount": parseInt(this.state.amount, 10)
                }, {
                    'headers': {
                        'Authorization': this.state.token,
                        'Content-Type': "application/json"
                    }
                })
                .then((response) => {
                    let bookingHistoryPayment = this.state.bookingHistoryPayment
                    bookingHistoryPayment.already_paid = parseInt(this.state.amount, 10)
                    this.setState({
                        loadingBut: false,
                        amount: 0,
                        note: "",
                        errAmount: "Thanh toán thành công!",
                        bookingHistoryPayment: bookingHistoryPayment
                    }, ()=>window.location.reload())
                })
                .catch((error) => {
                    console.log(error.response.data)
                    this.setState({
                        loadingBut: false,
                        errAmount: error.response.data.message
                    })
                })
            }
            else {
                axios.post(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/deposit`, {
                    "note": this.state.note,
                    "amount": parseInt(this.state.amount, 10)
                }, {
                    'headers': {
                        'Authorization': this.state.token,
                        'Content-Type': "application/json"
                    }
                })
                .then((response) => {
                    let bookingHistoryPayment = this.state.bookingHistoryPayment
                    bookingHistoryPayment.already_paid = parseInt(this.state.amount, 10)
                    this.setState({
                        loadingBut: false,
                        amount: 0,
                        note: "",
                        errAmount: "Thanh toán thành công!",
                        bookingHistoryPayment: bookingHistoryPayment
                    }, ()=>window.location.reload())
                })
                .catch((error) => {
                    this.setState({
                        loadingBut: false,
                        errAmount: error.response.data.message
                    })
                })
            }
        }

    }
    handleCloseModal = () => {
        this.setState({
            openModal: false,
            errAmount: ""
        })
    }
    handletest=()=>{
        console.log(this.state.status)
    }
    render() {
        if (!this.state.loading) {
            return (
                <Grid style={style.marginTotal0px} className="stadium-grid">
                    <Grid.Column textAlign="left" style={style.styleHeaderBreadcrumb} width={16}>
                        <Breadcrumb size="small">
                            <Link style={style.styleLinkBreadcrumb} to="/booking">Quản lý đặt sân</Link>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section active>{this.props.bookingID}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Grid.Column>
                    <Grid.Row><h3 style={style.marginTotal14px}>Thông tin đặt sân</h3></Grid.Row>
                    <Grid.Row style={style.marginTotal14px} centered={true}>
                        <Segment style={(this.props.isMobile)?style.fullWidth:style.width400px}>
                            <Form style={style.styleBookingForm} loading={this.state.loading} className="format-form">
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Mã đặt sân</label>
                                    <Form.Input>{this.state.bookingInfo.id}</Form.Input>
                                </Form.Field>
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Số điện thoại</label>
                                    <Form.Input>{this.state.creator.phone}</Form.Input>
                                </Form.Field>
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Sân con</label>
                                    <Form.Input>{this.state.bookingInfo.sc_name}</Form.Input>
                                </Form.Field>
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Ngày đá</label>
                                    <Form.Input>{this.dateConverter(this.state.bookingInfo.date_started)}</Form.Input>
                                </Form.Field>
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Giờ đá</label>
                                    <Form.Input>{this.timeConverter(this.state.bookingInfo.date_started,this.state.bookingInfo.date_ended)}</Form.Input>
                                </Form.Field>
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Trạng thái</label>
                                    <Form.Input style={this.handleStyleBookingStatus()}>
                                        {this.handleBookingStatus(this.state.bookingInfo.status)}
                                    </Form.Input>
                                </Form.Field>
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Giá</label>
                                    <Form.Input>{(!this.state.loading)?this.handleBookingMoney(this.state.bookingInfo.price):""}</Form.Input>
                                </Form.Field>
                                <Form.Field className="detail-form-booking" style={style.flexCenter}>
                                    <label style={style.styleInputBookingDetail}>Đã thanh toán</label>
                                    <Form.Input>{(!this.state.loading)?this.handleBookingMoney(this.state.bookingInfo.already_paid):""}</Form.Input>
                                </Form.Field>
                            </Form>
                            {
                                this.renderButton()
                            }
                        </Segment>
                    </Grid.Row>
                    {
                        ((this.state.bookingInfo.status === 2) || (this.state.bookingInfo.status === 7))?(
                            <Grid.Row><h3 style={style.marginTotal14px}>Lịch sử thanh toán</h3></Grid.Row>
                        ):""
                    }
                    {
                        ((this.state.bookingInfo.status === 2) || (this.state.bookingInfo.status === 7))?(
                            <Grid.Row>
                                <Grid.Column textAlign="left" width={16}>
                                    <Modal open={this.state.openModal} basic trigger={
                                        <Button style={style.paginationActive} onClick={this.handlePay}>{(this.state.bookingHistoryPayment.length > 0)?"Cập nhật":"Thanh toán"}</Button>
                                    }>
                                        <Modal.Content style={style.flexCenter}>
                                            <Form onSubmit={this.handleSubmit} className="format-form login-form ">
                                                <Icon onClick={() => this.handleCloseModal()} name="close" size="large" style={style.styleRTCloseIcon}/>
                                                <Form.Field style={style.flexCenter}>
                                                    <span style={{color: "#000"}} className="title-span">THANH TOÁN</span>                     
                                                </Form.Field>
                                                <Form.Field>
                                                    <span style={style.stylePayMessage}>{this.state.errAmount}</span>
                                                    <Form.Input value={this.state.amount} name="amount" type="number" min={0} onChange={this.handleChange} placeholder='Số tiền'/>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Form.Input value={this.state.note} name="note" onChange={this.handleChange} placeholder='Ghi chú'/>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Button loading={this.state.loadingBut} className="form-but" type='submit'>{(this.state.bookingHistoryPayment.length > 0)?"Cập nhật":"Thanh toán"}</Button>
                                                </Form.Field>
                                            </Form>
                                        </Modal.Content>
                                    </Modal>
                                </Grid.Column>
                                {
                                    (this.state.bookingHistoryPayment.length > 0)?(
                                        <Grid.Column style={style.marginTopBot} width={16}>
                                            <Table celled striped unstackable={true}>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>Số tiền</Table.HeaderCell>
                                                        <Table.HeaderCell>Ghi chú</Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                {
                                                    this.state.bookingHistoryPayment.map(x => {
                                                        return (
                                                            <Table.Row key={x.id}>
                                                                <Table.Cell>{x.amount}</Table.Cell>
                                                                <Table.Cell>{x.note}</Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    })
                                                }
                                                </Table.Body>
                                            </Table>
                                        </Grid.Column>
                                    ):""
                                }
                            </Grid.Row>
                        ):""
                    }
                </Grid>
            )
        }
        else return ""
    }
}

export default BookingForm;