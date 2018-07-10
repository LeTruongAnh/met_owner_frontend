import React, { Component } from 'react'
import { Grid, Tab, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import StadiumForm from './stadium-form'
import StadiumImage from './stadium-image'
import style from '../dashboard/style.js'
import axios from 'axios'
import config from '../config'

class StadiumInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeIndex: 0,
			numberImageChange: 0,
			userInfo: JSON.parse(localStorage.getItem('MET_userInfo')),
			stadiumData: {},
			cityList: [],
			imageList: [],
			loading: true
		}
	}
	handleTabImage = (number) => {
		this.setState({
			activeIndex: 1,
			numberImageChange: number
		})
	}
	handleTabForm = () => {
		this.setState({
			activeIndex: 0,
			numberImageChange: 0
		})
	}
	handleImageChange = (url) => {
		if (url !== "") {
			let stadiumData = this.state.stadiumData
			stadiumData.image = url
			this.setState({ stadiumData: stadiumData })
		}
	}
	handleBgImageChange = (url) => {
		if (url !== "") {
			let stadiumData = this.state.stadiumData
			stadiumData.bg_image = url
			this.setState({ stadiumData: stadiumData })
		}
	}
	handleTabChange = (e, data) => {
		if (data.activeIndex === 0)
			this.setState({ numberImageChange: 0 } )
		this.setState({
			activeIndex: data.activeIndex
		})
	}
	fetchData = () => {
		axios.get(`${config.apiBaseURL}/api/stadium/` + this.state.userInfo.default_stadium_id, {
			'headers': {'Authorization': this.state.userInfo.token}
		})
		.then((response) => {
			this.setState({
				stadiumData: response.data,
				imageList: response.data.image_list,
				loading: false
			})
		})
		.catch(function (error) {
			console.log(error)
		})
	}
	componentDidMount = () => {
		if (this.state.userInfo) {
			axios.get(`${config.apiBaseURL}/api/region/province`)
			.then((response) => {
				this.setState({
					cityList: response.data.items
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
						<Tab style={style.fullWidth} onTabChange={this.handleTabChange} activeIndex={this.state.activeIndex} menu={{ secondary: true, pointing: true }} 
						panes={
							[
								{ menuItem: 'Thông tin sân', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<StadiumForm
										handleTabImage={this.handleTabImage}
										stadiumData={this.state.stadiumData}
										cityList={this.state.cityList}
									/></Tab.Pane> },
								{ menuItem: 'Hình ảnh sân', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<StadiumImage
										handleImageChange={this.handleImageChange}
										handleBgImageChange={this.handleBgImageChange}
										numberImageChange={this.state.numberImageChange}
										imageList={this.state.imageList}
										handleTabForm={this.handleTabForm}
									/></Tab.Pane> },
								{ menuItem: 'Quản lý sân', render: () => <Tab.Pane className="detail-stadium" attached={false}>Quản lý sân</Tab.Pane> },
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

export default StadiumInfo;