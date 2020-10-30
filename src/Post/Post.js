import React, { Component } from 'react'
import UrlStore from '../UrlStore'
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
            image: null,
            progress: null,
            warning: false,
            finished: false
        }
    }

    imgSelectedHandler = (event) => {

        this.setState({
            selectedFile: event.target.files[0]
        })
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({ image: URL.createObjectURL(img), finished: false });
        }
    }

    checkDimensions = () => {

        let img = document.getElementById("UploadImg");
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (height > width) {
            this.setState({ warning: true })
        } else {
            this.setState({ warning: false })
        }
    }

    imgUploadHandler = () => {

        const fd = new FormData()
        fd.append('image', this.state.selectedFile)
        // axios.post("https://api.imgbb.com/1/upload?expiration=60&key=eeadc880da3384d7927fb106962183a2&name=" + uuid.v4() + "&image=", fd, {
        axios.post("https://api.imgbb.com/1/upload?key=eeadc880da3384d7927fb106962183a2&name=" + uuid.v4() + "&image=", fd, {
            onUploadProgress: ProgressEvent => {
                // console.log("Progress: " + Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) + "%")
                this.setState({ progress: Math.round(ProgressEvent.loaded / ProgressEvent.total * 100) })
            }
        })
            .then(res => {
                this.setState({ response: res, finished: true, progress: null, image: null, selectedFile: null })
                this.updateRows(this.state.response.data.data.display_url, this.state.response.data.data.delete_url)
            });
    }

    updateRows = async (large, del) => {

        if (this.state.response) {
            fetch(UrlStore + '/api/lights', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lat: Location.lat,
                    lng: Location.lng,
                    url: large,
                    id: uuid.v4(),
                    user: window.user,
                    del: del,
                    upvotes: '{}',
                    trips: '{}',
                    uploaded: Date.now(),
                    on: 't'
                })
            })
        }
    }

    render() {
        return (
            <div>
                {window.user && <div className="Upload_Container">
                    {this.state.finished && <p id="success">Success!!!</p>}
                    <label className="custom-file-upload">
                        <input id="ChooseFile" type="file" onChange={this.imgSelectedHandler} />
                Choose File
                </label>
                    {!this.state.image && <img src="./res/2.png" id="noImg" alt='A tree'></img>}
                    {this.state.image && <img id="UploadImg" src={this.state.image} alt="oops" onLoad={this.checkDimensions} />}
                    <img id="arrow-img" src="./res/upload.png" alt="oops" />
                    {this.state.progress > 0 && <p id="progress">{this.state.progress} %</p>}
                    {this.state.image && !this.state.warning && <p id="UploadBtn" onClick={this.imgUploadHandler}>Post</p>}
                    {this.state.warning && <p id="warning">Error!!! The photo seems to be in portrait, Luster is intended for landscape photos only.</p>}
                    {this.state.finished && !this.state.warning && <p id="finished">Your photo is under review by the LightMaps Image AI, you should receive an email shortly with a decision. </p>}
                </div>}
                {!window.user && <div className="Unvalidated">
                    <h3>
                        Log in or Register to post photos!
                </h3>
                    <img src="./res/2.png" id="noImg" alt='A tree'></img>

                </div>}
            </div>

        );
    }
}

export default Post