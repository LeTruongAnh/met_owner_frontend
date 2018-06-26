import React, { Component } from 'react'
import { Grid, Tab } from 'semantic-ui-react'
import StadiumForm from './stadium-form.js'

const panes = [
	{ menuItem: 'Thông tin sân', render: () => <Tab.Pane className="content-content-tab" attached={false}><StadiumForm /></Tab.Pane> },
	{ menuItem: 'Hình ảnh sân', render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
]

class StadiumInfo extends Component {
	render() {
		return (
			<Grid.Column className="stadium-info">
				<Tab menu={{ secondary: true, pointing: true }} panes={panes} />
			</Grid.Column>
		)
	}
}

export default StadiumInfo;