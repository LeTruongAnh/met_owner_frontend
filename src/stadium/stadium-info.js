import React, { Component } from 'react'
import { Grid, Tab } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import StadiumForm from './stadium-form.js'
import StadiumImage from './stadium-image.js'
import style from '../dashboard/style.js'

const panes = [
	{ menuItem: 'Thông tin sân', render: () => <Tab.Pane className="detail-stadium" attached={false}><StadiumForm /></Tab.Pane> },
	{ menuItem: 'Hình ảnh sân', render: () => <Tab.Pane className="detail-stadium" attached={false}><StadiumImage content={false} /></Tab.Pane> },
]

class StadiumInfo extends Component {
	render() {
		if (!localStorage.getItem('MET_userInfo'))
			return <Redirect to="/login"/>
		else
			return (
				<Grid style={{margin: "0"}} className="stadium-info">
					<Tab style={style.fullWidth} menu={{ secondary: true, pointing: true }} panes={panes} />
				</Grid>
			)
	}
}

export default StadiumInfo;