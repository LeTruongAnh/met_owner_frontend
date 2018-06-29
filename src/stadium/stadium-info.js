import React, { Component } from 'react'
import { Grid, Tab } from 'semantic-ui-react'
import StadiumForm from './stadium-form.js'
import StadiumImage from './stadium-image.js'

const panes = [
	{ menuItem: 'Thông tin sân', render: () => <Tab.Pane className="detail-stadium" attached={false}><StadiumForm /></Tab.Pane> },
	{ menuItem: 'Hình ảnh sân', render: () => <Tab.Pane className="detail-stadium" attached={false}><StadiumImage /></Tab.Pane> },
]

class StadiumInfo extends Component {
	render() {
		return (
			<Grid.Row className="stadium-info">
				<Tab menu={{ secondary: true, pointing: true }} panes={panes} />
			</Grid.Row>
		)
	}
}

export default StadiumInfo;