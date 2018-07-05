import React, { Component } from 'react'

class ImagePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      imgScr: "/images/wireframe/image.png"
    }
  }
  handleFileChange = (event) => {

  }
  render() {
    return (
      <div>
        <input 
          type="file"
          onChange={this.handleFileChange}
        />
        <img scr={this.state.imgScr}></img>
      </div>
    )
  }
}

export default ImagePicker