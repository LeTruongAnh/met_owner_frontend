import React, { Component } from 'react'
import { Grid, Tab, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import Profile from './profile'
import ImageProfile from './image-profile'
//import ListStadium from './list-stadium'
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
            imageList: [],
            screenSize: window.innerWidth
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
    handleAddImage = (lst) => {
        this.setState({ imageList: lst})
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
    componentDidMount = () => {
        if (this.state.userInfo.token) {
            axios.get(`${config.apiBaseURL}/api/user/pictures?userID=${this.state.userInfo.id}&page=1&limit=12`, {
                'headers': {'Authorization': this.state.userInfo.token}
            })
            .then((response) => {
                this.setState({
                    imageList: response.data.items.filter((x) => x.includes("_thumbnail.jpg")),
                    loading: false
                })
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    loading: false
                })
            })
        }
        window.addEventListener('resize',this.detectScreenChange)
    }
    detectScreenChange = () => {
        this.setState({ screenSize: window.innerWidth })
    }
    render() {
        if (!localStorage.getItem('MET_userInfo'))
            return <Redirect to="/login"/>
        else {
            if (!this.state.loading) {
                return (
                    <Grid style={style.marginTotal0px} className="stadium-info">
                        <Tab className="menu-tab" onTabChange={this.handleTabChange} activeIndex={this.state.activeIndex}
                        style={style.styleClassInfo} menu={{ secondary: true, pointing: true }} 
                        panes={
                            [
                                { menuItem: (this.state.screenSize >= 768)?'Thông tin chủ sân':'Thông tin', render: () => <Tab.Pane className="detail-stadium" attached={false}>
                                    <Profile
                                        userInfo={this.state.userInfo}
                                        handleTabImage={this.handleTabImage}
                                    /></Tab.Pane> },
                                { menuItem: (this.state.screenSize >= 768)?'Hình ảnh chủ sân':'Hình ảnh', render: () => <Tab.Pane className="detail-stadium" attached={false}>
                                    <ImageProfile
                                        handleAddImage={this.handleAddImage}
                                        handleAvatarChange={this.handleAvatarChange}
                                        isImageChange={this.state.isImageChange}
                                        handleTabForm={this.handleTabForm}
                                        imageList={this.state.imageList}
                                    /></Tab.Pane> },
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