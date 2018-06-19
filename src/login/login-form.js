import React, { Component } from 'react'
import { Button, Form, Grid } from 'semantic-ui-react'

class LoginForm extends Component {
	render() {
		return (
			<Grid className="grid-form" centered={true}>
				<Form className="format-form login-form">
					<h1>MET CHỦ SÂN</h1>
				    <Form.Field>
				      	<input placeholder='Số điện thoại' />
				    </Form.Field>
				    <Form.Field>
				      	<input placeholder='Mật khẩu' />
				    </Form.Field>
				    <Button color="green" type='submit'>Đăng nhập</Button>
			  	</Form>
		  	</Grid>
	  	);
	}
}

export default LoginForm;