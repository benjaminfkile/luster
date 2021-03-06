import React, { Component } from 'react'
import ApiStore from '../ApiStore'
import axios from 'axios'
import uuid from "uuid";
import './Upload.css'

class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            response: null,
            image: null,
            progress: null,
            warning: false,
            finished: false,
        }
    }
    //store the image locally
    imgSelectedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        })
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({ image: URL.createObjectURL(img), finished: false });
        }
    }
    //make sure the image is landscape
    checkDimensions = () => {
        let img = document.getElementById("upload-img");
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (height > width) {
            this.setState({ warning: true })
        } else {
            this.setState({ warning: false })
        }
    }
    //upload the image to imgbb.com with a 60 second expiration expiration time
    //if the API approves the image the API will make a copy of the image and repost to imgbb.com with no expiration time
    imgUploadHandler = () => {
        const fd = new FormData()
        fd.append('image', this.state.selectedFile)
        axios.post("https://api.imgbb.com/1/upload?expiration=60&key=eeadc880da3384d7927fb106962183a2&name=" + uuid.v4() + "&image=", fd, {
            onUploadProgress: ProgressEvent => {
                this.setState({ progress: Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) })
            }
        })
            .then(res => {
                this.setState({ response: res, finished: true, progress: null, image: null, selectedFile: null })
                this.insertRow(this.state.response.data.data.display_url, this.state.response.data.data.delete_url)
            });
    }
    //post the row data to the API
    insertRow = async (large, del) => {
        if (this.state.response && this.props.lat) {
            let lat = this.props.lat
            let lng = this.props.lng

            fetch(ApiStore + '/api/lights/whamo,blamo', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lat: lat,
                    lng: lng,
                    url: large,
                    id: uuid.v4(),
                    user: window.user,
                    pass: window.pass,
                    del: del,
                    upvotes: '{}',
                    trips: '{}',
                    uploaded: Date.now(),
                    on: 't',
                    dummy: 'f',//image will be a dummy image(for deciphering test images vs actuals)
                    pin: (Math.floor(Math.random() * (15 - 1 + 1)) + 1) + ''//pick a marker for the image
                })
            })
        }
    }

    render() {

        return (
            <div>
                <div className="Upload_Container">
                    {this.state.finished && <p id="success">Success!!!</p>}
                    <label className="custom-file-upload">
                        <input id="ChooseFile" type="file" onChange={this.imgSelectedHandler} />
                Choose File
                </label>
                    {!this.state.image && <h3>FLASH OFF | NO FACES</h3>}
                    {!this.state.image && <img src="./res/upload-placeholder.png" id="img-placeholder" alt='A tree'></img>}
                    {this.state.image && <img id="upload-img" src={this.state.image} alt="oops" onLoad={this.checkDimensions} />}
                    {this.state.progress > 0 && <p id="progress">{this.state.progress} %</p>}
                    {this.state.image && !this.state.warning && <p id="UploadBtn" onClick={this.imgUploadHandler}>Post</p>}
                    {this.state.warning && <p id="warning">Error!!! The photo seems to be in portrait, Luster is intended for landscape photos only.</p>}
                    {this.state.finished && !this.state.warning && <p id="finished">Your photo is under review by the LightMaps Image AI, you should receive an email shortly with a decision. </p>}
                </div>
            </div>
        );
    }
}

export default Upload