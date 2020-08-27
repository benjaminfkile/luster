import React, { Component } from 'react'
import Location from "../Location"
import axios from 'axios'
import uuid from "uuid";
import '../Post/Post.css'

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            response: null,
            image: null
        }
        this.imgSelectedHandler = this.imgSelectedHandler.bind(this);
    }

    imgSelectedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        })
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
                image: URL.createObjectURL(img)
            });
        }
    }

    imgUploadHandler = () => {
        const fd = new FormData()
        fd.append('image', this.state.selectedFile)
        console.log(fd)
        axios.post("https://api.imgbb.com/1/upload?key=eeadc880da3384d7927fb106962183a2&name=" + Math.random() / Math.random() + "&image=", fd)
            .then(res => {
                this.setState({ response: res })
                this.updateRows(this.state.response.data.data.display_url)
            });
    }

    updateRows = (args) => {
        if (this.state.response) {
            console.log(this.state.response.data.data.display_url)
            // fetch('http://localhost:8004/api/lights', {
                fetch('https://agile-wildwood-40014.herokuapp.com/api/lights', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lat: Location.lat,
                    lng: Location.lng,
                    url: args,
                    rating: 5,
                    id: Math.random()/Math.random()
                })
            }).then((response) => {
            }).then(() => {
                // window.location.href = window.location.origin
            });
        }
    }

    render() {
        console.log(Location)
        if (this.state.response) {
            console.log(this.state.response.data.data.display_url)
        }
        return (
            <div className="Upload_Container">
                <input id="ChooseFile" type="file" onChange={this.imgSelectedHandler} />
                {this.state.image && <img id="UploadImg" src={this.state.image} alt="oops" />}
                {this.state.image && <button id="UploadBtn" onClick={this.imgUploadHandler}>Upload</button>}
            </div>
        );
    }
}

export default Post