import React, { Component } from 'react'
import { Grid, Tab, Loader, Breadcrumb } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import StadiumForm from './stadium-form'
import StadiumImage from './stadium-image'
import StadiumManager from './stadium-manager'
import StadiumChild from './stadium-child'
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
			loading: true,
			managerList: [],
			stadiumChild: [],
			screenSize: window.innerWidth
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
			stadiumData.image_background = url
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
	handleAddImage = (lst) => {
		this.setState({ imageList: lst})
	}
	fetchData = () => {
		let loading1 = true
		let loading2 = true
		let loading3 = true
		axios.get(`${config.apiBaseURL}/api/stadium/${this.state.userInfo.default_stadium_id}`, {
			'headers': {'Authorization': this.state.userInfo.token}
		})
		.then((response) => {
			this.setState({
				stadiumData: response.data,
				imageList: response.data.image_list.filter((x) => x.includes("_thumbnail.jpg"))
			}, () => {
				loading1 = false
				if (!loading1 && !loading2 && !loading3) this.setState({ loading: false })
			})
		})
		.catch((error) => {
			console.log(error)
			loading1 = false
			if (!loading1 && !loading2 && !loading3) this.setState({ loading: false })
		})
		axios.get(`${config.apiBaseURL}/api/stadium/manager?stadiumID=${this.state.userInfo.default_stadium_id}`, {
			'headers': {'Authorization': this.state.userInfo.token}
		})
		.then((response) => {
			this.setState({
				managerList: response.data.items,
			}, () => {
				loading2 = false
				if (!loading1 && !loading2 && !loading3) this.setState({ loading: false })
			})
		})
		.catch((error) => {
			console.log(error)
			loading2 = false
			if (!loading1 && !loading2 && !loading3) this.setState({ loading: false })
		})
		axios.get(`${config.apiBaseURL}/api/stadium/child?stadiumID=${this.state.userInfo.default_stadium_id}`, {
			'headers': {'Authorization': this.state.userInfo.token}
		})
		.then((response) => {
			this.setState({ stadiumChild: response.data }, () => {
				loading3 = false
				if (!loading1 && !loading2 && !loading3) this.setState({ loading: false })
			})
		})
		.catch((error) => {
			console.log(error)
			loading3 = false
			if (!loading1 && !loading2 && !loading3) this.setState({ loading: false })
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
			.catch((error) => {
				console.log(error)
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
						<Grid.Column textAlign="left" style={style.styleHeaderBreadcrumb} width={16}>
							<Breadcrumb size="small">
								<Breadcrumb.Section active>Quản lý sân</Breadcrumb.Section>
							</Breadcrumb>
						</Grid.Column>
						<Tab style={style.styleClassInfo} onTabChange={this.handleTabChange} activeIndex={this.state.activeIndex}
						menu={{ secondary: true, pointing: true, style: (this.state.screenSize >= 377)?style.none:style.scrollX }} 
						panes={
							[
								{ menuItem: (this.state.screenSize >= 768)?'Thông tin sân':'Thông tin', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<StadiumForm
										handleTabImage={this.handleTabImage}
										stadiumData={this.state.stadiumData}
										cityList={this.state.cityList}
									/></Tab.Pane>
								},
								{ menuItem: (this.state.screenSize >= 768)?'Hình ảnh sân':'Hình ảnh', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<StadiumImage
										handleAddImage={this.handleAddImage}
										handleImageChange={this.handleImageChange}
										handleBgImageChange={this.handleBgImageChange}
										numberImageChange={this.state.numberImageChange}
										imageList={this.state.imageList}
										handleTabForm={this.handleTabForm}
									/></Tab.Pane>
								},
								{ menuItem: (this.state.screenSize >= 768)?'Quản lý sân':'Quản lý', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<StadiumManager
										managerlist={this.state.managerList}
									/></Tab.Pane>
								},
								{ menuItem: 'Sân con', render: () => <Tab.Pane className="detail-stadium" attached={false}>
									<StadiumChild
										stadiumChild={this.state.stadiumChild}
									/></Tab.Pane>
								},
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