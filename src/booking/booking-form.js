import React, { Component } from 'react'
import { Form, Grid, Segment, Button, Message, Breadcrumb, Table, Modal, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../config.js'
import style from '../dashboard/style.js'
import CountDownTime from './count-down-time'
import BookingHistoryDetail from './booking-history-detail'

class BookingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screenSize: window.innerWidth,
            token: (localStorage.getItem('MET_userInfo'))?JSON.parse(localStorage.getItem('MET_userInfo')).token:"",
            bookingInfo: [],
            bookingPayment: [],
            creator: {},
            loading: true,
            approved: false,
            canceled: false,
            note: "",
            amount: "",
            errAmount: "",
            loadingBut: false,
            loadingUpdateBut: false,
            openModal: false,
            openUpdateModal: false,
            openHistoryModal: false
        }
    }
    componentDidMount = () => {
        window.addEventListener('resize',this.detectScreenChange)
        axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/payment`, {
            'headers': {'Authorization': this.state.token}
        })
        .then((response) => {
            this.setState({ 
                bookingPayment: response.data.items
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
                creator: response.data.creator
            }, () => this.setState({ loading: false }))
        })
        .catch((error) => {
            console.log(error)
        })
    }
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
        this.setState({ loading: true })
        axios.post(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/approve`, {}, {
            'headers': {
                'Authorization': this.state.token,
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
            axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}`, {
                'headers': {'Authorization': this.state.token}
            })
            .then((response) => {
                this.setState({ 
                    bookingInfo: response.data,
                    creator: response.data.creator
                }, () => this.setState({ loading: false }))
            })
            .catch((error) => {
                console.log(error)
                this.setState({ loading: false })
            })
            this.setState({ approved: true })
        })
        .catch((error) => {
            console.log(error)
            this.setState({ loading: false })
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
            axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}`, {
                'headers': {'Authorization': this.state.token}
            })
            .then((response) => {
                this.setState({ 
                    bookingInfo: response.data,
                    creator: response.data.creator
                }, () => this.setState({ loading: false }))
            })
            .catch((error) => {
                console.log(error)
                this.setState({ loading: false })
            })
            this.setState({ canceled: true })
        })
        .catch((error) => {
            console.log(error)
            this.setState({ loading: false })
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
    handleBookingMoney = num => {
        let moneyString = ""
        while (num >= 1000) {
            let surplus = num % 1000
            let temp = ""
            if (surplus >= 100)
                temp = `.${surplus}`
            else if (surplus >= 10)
                temp = `.0${surplus}`
            else
                temp =`.00${surplus}`
            moneyString = `${temp}${moneyString}`
            num = Math.floor(num / 1000)
        }
        return moneyString = `${num}${moneyString}`
    }
    handleChange = (e) => this.setState({[e.target.name]: e.target.value})
    handleCheckAmount = () => {}
    handlePay = () => {
        this.setState({ openModal: true })
    }
    handleUpdatePay = () => {
        this.setState({ openUpdateModal: true })
    }
    handleSubmit = () => {
        this.setState({ loadingBut: true })
        let isOK = true
        if (this.state.amount === "" || (this.state.amount <= 0)) {
            this.setState({ errAmount: "Nhập số tiền thanh toán"})
            isOK = false
        }
        else {
            this.setState({ errAmount: ""})
        }
        if (isOK) {
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
                axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/payment`, {
                    'headers': {'Authorization': this.state.token}
                })
                .then((response) => {
                    this.setState({ 
                        bookingPayment: response.data.items,
                        loadingBut: false,
                        amount: "",
                        note: "",
                        errAmount: "Thanh toán thành công!"
                    })
                })
                .catch((error) => {
                    this.setState({
                        loadingBut: false
                    })
                })
                axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}`, {
                    'headers': {'Authorization': this.state.token}
                })
                .then((response) => {
                    this.setState({ 
                        bookingInfo: response.data,
                        creator: response.data.creator
                    }, () => this.setState({ loading: false }))
                })
                .catch((error) => {
                    console.log(error)
                })
            })
            .catch((error) => {
                this.setState({
                    loadingBut: false,
                    errAmount: error.response.data.message
                })
            })
        }

    }
    handleUpdateSubmit = (numID) => {
        this.setState({ loadingUpdateBut: true })
        let isOK = true
        if (this.state.amount === "" || (this.state.amount <= 0)) {
            this.setState({ errAmount: "Nhập số tiền thanh toán"})
            isOK = false
        }
        else {
            this.setState({ errAmount: ""})
        }
        if (isOK) {
            axios.put(`${config.apiBaseURL}/api/booking/payment/${numID}`, {
                "note": this.state.note,
                "amount": parseInt(this.state.amount, 10)
            }, {
                'headers': {
                    'Authorization': this.state.token,
                    'Content-Type': "application/json"
                }
            })
            .then((response) => {
                axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}/payment`, {
                    'headers': {'Authorization': this.state.token}
                })
                .then((response) => {
                    this.setState({ 
                        bookingPayment: response.data.items,
                        loadingUpdateBut: false,
                        amount: "",
                        note: "",
                        errAmount: "Cập nhật thành công!"
                    })
                })
                .catch((error) => {
                    this.setState({
                        loadingUpdateBut: false,
                        errAmount: error.response.data.message
                    })
                })
                axios.get(`${config.apiBaseURL}/api/booking/${this.props.bookingID}`, {
                    'headers': {'Authorization': this.state.token}
                })
                .then((response) => {
                    this.setState({ 
                        bookingInfo: response.data,
                        creator: response.data.creator
                    }, () => this.setState({ loading: false }))
                })
                .catch((error) => {
                    console.log(error)
                })
            })
            .catch((error) => {
                this.setState({
                    loadingUpdateBut: false,
                    errAmount: error.response.data.message
                })
            })
        }
    }
    handleViewHistory = () => {
        this.setState({ openHistoryModal: true })
    }
    handleCloseModal = () => {
        this.setState({
            openModal: false,
            errAmount: ""
        })
    }
    handleCloseUpdateModal = () => {
        this.setState({
            openUpdateModal: false,
            errAmount: ""
        })
    }
    handleCloseHistoryModal = () => {
        this.setState({
            openHistoryModal: false
        })
    }
    render() {
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
                                    <Button style={style.paginationActive} onClick={this.handlePay}>Thanh toán</Button>
                                }>
                                    <Modal.Content style={style.flexCenter}>
                                        <Form onSubmit={this.handleSubmit} className="format-form login-form ">
                                            <Icon onClick={() => this.handleCloseModal()} name="close" size="large" style={style.styleRTCloseIcon}/>
                                            <Form.Field style={style.flexCenter}>
                                                <span style={{color: "#000"}} className="title-span">THANH TOÁN</span>                     
                                            </Form.Field>
                                            <Form.Field>
                                                <span style={style.stylePayMessage}>{this.state.errAmount}</span>
                                                <Form.Input value={this.state.amount} name="amount" type="number" onChange={this.handleChange} placeholder='Số tiền'/>
                                            </Form.Field>
                                            <Form.Field>
                                                <Form.Input value={this.state.note} name="note" onChange={this.handleChange} placeholder='Ghi chú'/>
                                            </Form.Field>
                                            <Form.Field>
                                                <Button loading={this.state.loadingBut} className="form-but" type='submit'>Thanh toán</Button>
                                            </Form.Field>
                                        </Form>
                                    </Modal.Content>
                                </Modal>
                            </Grid.Column>
                            {
                                (this.state.bookingPayment.length > 0)?(
                                    <Grid.Column style={style.marginTopBot} width={16}>
                                        <Table celled striped unstackable={true}>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Thời gian</Table.HeaderCell>
                                                    <Table.HeaderCell>Số tiền</Table.HeaderCell>
                                                    <Table.HeaderCell>Ghi chú</Table.HeaderCell>
                                                    <Table.HeaderCell textAlign="center"></Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                            {
                                                this.state.bookingPayment.map((x, index) => {
                                                    return (
                                                        <Table.Row key={index}>
                                                            <Table.Cell>{this.handleTimeString(x.date_created)}</Table.Cell>
                                                            <Table.Cell>{x.amount}</Table.Cell>
                                                            <Table.Cell>{x.note}</Table.Cell>
                                                            <Table.Cell textAlign="center">
                                                                <Button.Group>
                                                                    <Modal open={this.state.openHistoryModal} basic trigger={
                                                                        <Button style={{backgroundColor: "#f15a26", color: "#fff"}} onClick={this.handleViewHistory}>Lịch sử</Button>
                                                                    }>
                                                                        <Modal.Content style={style.flexCenter}>
                                                                            <Icon onClick={() => this.handleCloseHistoryModal()} name="close" size="large" style={style.styleRTCloseIcon}/>
                                                                            <BookingHistoryDetail lst={x.history} />
                                                                        </Modal.Content>
                                                                    </Modal>
                                                                    <Modal open={this.state.openUpdateModal} basic trigger={
                                                                        <Button style={{backgroundColor: "#ed1c24", color: "#fff"}} onClick={this.handleUpdatePay}>Cập nhật</Button>
                                                                    }>
                                                                        <Modal.Content style={style.flexCenter}>
                                                                            <Form className="format-form login-form ">
                                                                                <Icon onClick={() => this.handleCloseUpdateModal()} name="close" size="large" style={style.styleRTCloseIcon}/>
                                                                                <Form.Field style={style.flexCenter}>
                                                                                    <span style={{color: "#000"}} className="title-span">Cập nhật</span>                     
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <span style={style.stylePayMessage}>{this.state.errAmount}</span>
                                                                                    <Form.Input value={this.state.amount} name="amount" type="number" onChange={this.handleChange} placeholder='Số tiền'/>
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <Form.Input value={this.state.note} name="note" onChange={this.handleChange} placeholder='Ghi chú'/>
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <Button onClick={() => this.handleUpdateSubmit(x.id)} loading={this.state.loadingUpdateBut} className="form-but" type='submit'>Cập nhật</Button>
                                                                                </Form.Field>
                                                                            </Form>
                                                                        </Modal.Content>
                                                                    </Modal>
                                                                </Button.Group>
                                                            </Table.Cell>
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
}

export default BookingForm;