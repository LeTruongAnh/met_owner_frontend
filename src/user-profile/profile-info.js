import React, { Component } from 'react'
import { Grid, Tab, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Profile from './profile'
import ImageProfile from './image-profile'
import ListStadium from './list-stadium'
import style from '../dashboard/style.js'
import axios from 'axios'
import config from '../config'

class ProfileInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            isImageChange: false,
            userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
            loading: true,
            stadiumList: [],
            imageList: []
        }
    }
   handleTabImage = () => {
        this.setState({
            activeIndex: 1,
            isImageChange: true
        })
    }
    handleTabForm = () => {
        this.setState({
            activeIndex: 0,
            isImageChange: false
        })
    }
    handleAvatarChange = (url) => {
        if (url !== "") {
            let userInfo = this.state.userInfo
            userInfo.avatar = url
            this.setState({ userInfo: userInfo })
        }
    }
    handleTabChange = (e, data) => {
        if (data.activeIndex === 0)
            this.setState({ isImageChange: false } )
        this.setState({
            activeIndex: data.activeIndex
        })
    }
    fetchData = () => {
        axios.get(`${config.apiBaseURL}/api/stadium/list?page=1&limit=10`, {
            'headers': {'Authorization': this.state.userInfo.token}
        })
        .then((response) => {
            this.setState({
                stadiumList: response.data.items,
                loading: false
            })
        })
        .catch(function (error) {
            console.log(error)
        })
    }
    componentDidMount = () => {
        if (this.state.userInfo.token) {
            axios.get(`${config.apiBaseURL}/api/user/pictures?userID=${this.state.userInfo.id}&page=1&limit=12`, {
                'headers': {'Authorization': this.state.userInfo.token}
            })
            .then((response) => {
                this.setState({
                    imageList: response.data.items
                }, this.fetchData)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    }
    render() {
        if (!localStorage.getItem('MET_userInfo'))
            return <Redirect to="/login"/>
        else {
            if (!this.state.loading) {
                return (
                    <Grid style={{margin: "0"}} className="stadium-info">
                        <Tab onTabChange={this.handleTabChange} activeIndex={this.state.activeIndex} style={style.fullWidth} menu={{ secondary: true, pointing: true }} 
                        panes={
                            [
                                { menuItem: 'Thông tin chủ sân', render: () => <Tab.Pane className="detail-stadium" attached={false}>
                                    <Profile
                                        userInfo={this.state.userInfo}
                                        handleTabImage={this.handleTabImage}
                                    /></Tab.Pane> },
                                { menuItem: 'Hình ảnh', render: () => <Tab.Pane className="detail-stadium" attached={false}>
                                    <ImageProfile
                                        handleAvatarChange={this.handleAvatarChange}
                                        isImageChange={this.state.isImageChange}
                                        handleTabForm={this.handleTabForm}
                                        imageList={this.state.imageList}
                                    /></Tab.Pane> },
                                { menuItem: 'Danh sách sân', render: () => <Tab.Pane className="detail-stadium" attached={false}>
                                    <ListStadium
                                        stadiumList={this.state.stadiumList}
                                    /></Tab.Pane> }
                            ]
                        } />
                    </Grid>
                )
            }
            else {
                return <Loader active={this.state.loading} />
            }
        }
    }
}

export default ProfileInfo