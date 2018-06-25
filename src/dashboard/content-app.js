import React, { Component } from 'react'
import { Grid, Tab } from 'semantic-ui-react'
import logo from '../asset/favicon.png'
import ContentAppForm from './content-app-form.js'

const panes = [
	{ menuItem: 'Thông tin sân', render: () => <Tab.Pane className="content-content-tab" attached={false}><ContentAppForm /></Tab.Pane> },
	{ menuItem: 'Hình ảnh sân', render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
]

class ContentApp extends Component {
	render() {
		return (
			<Grid.Column className="content-grid">
				<Tab menu={{ secondary: true, pointing: true }} panes={panes} />
			</Grid.Column>
		)
	}
}

export default ContentApp;