import React, { Component } from 'react'
import ApiStore from '../ApiStore'
import Contributor from '../Contributor/Contributor';
import Spinner from '../Spinner/Spinner'
import './Preview.css'

class Preview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            liked: false,
            likes: 0,
        };
    }
    //makes sure the user cant upvote the image if they already did
    upvoteHistory = (args) => {
        for (let i = 0; i < this.props.lights[args].upvotes.length; i++) {
            if (this.props.lights[args].upvotes[i] === window.user) {
                this.setState({ liked: true, likes: this.props.lights[args].upvotes.length })
            }
        }
    }
    //casts an upvote
    upvote = (args) => {
        if (window.user && window.pass) {
            fetch(ApiStore + '/api/stats/upvote', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.props.lights[args].id,
                    userId: window.user,
                    pass: window.pass
                })
            })
        }
        this.toggleUpvote(args)
    }
    //upvotes or un-upvotes an image
    toggleUpvote = (args) => {
        if (this.state.liked) {
            if (this.props.lights[args].upvotes && this.props.lights[args].upvotes.length > 0) {
                let i = this.props.lights[args].upvotes.indexOf(window.user);
                if (i > -1) {
                    this.props.lights[args].upvotes.splice(i, 1);
                }
                this.setState({ liked: false, likes: this.props.lights[args].upvotes.length })
            }
        } else {
            this.props.lights[args].upvotes.push(window.user)
            this.setState({ liked: true, likes: this.props.lights[args].upvotes.length })
        }
    }
    //cast a trip when the user clicks the nav button
    trip = (args) => {
        let user = ''
        if (window.user) {
            user += window.user + "@:" + Date.now()
        } else {
            user += "no-data@:" + Date.now()
        }
        this.props.lights[this.props.lightDex].trips.push('trip')
        fetch(ApiStore + '/api/stats/trip', {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.lights[args].id,
                ip: user
            })
        })
    }
    //checks if image loaded
    handleImageLoaded = () => {
        if (!this.props.contributions) {
            this.setState({ loaded: true, liked: false, likes: this.props.lights[this.props.lightDex].upvotes.length });
            this.upvoteHistory(this.props.lightDex)
        } else {
            this.setState({ loaded: true, liked: false })
        }
    }
    //unliad the image
    unloadImg = () => {
        this.setState({ loaded: false, liked: false })
        this.props.togglePreview(-1)
    }

    render() {

        return (
            <div>
                {this.props.lightDex !== -1 && !this.props.contributions && <div className="Preview_User">
                    <img src={this.props.lights[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt={this.props.lights[this.props.lightDex].id} height={0} width={0}></img>
                    {this.state.loaded && <img src={this.props.lights[this.props.lightDex].url} id="preview-img" alt={this.props.lights[this.props.lightDex].id}></img>}
                    {!this.state.loaded && <Spinner />}
                    {this.state.loaded && <div className="Preview_User_Interface">
                        <div id="stats">
                            <img id="upvotes-img" src="./res/upvotes.png" alt="upvotes"></img>
                            <p>
                                {'Upvotes: ' + this.state.likes}
                            </p>
                        </div>
                        {window.user && this.state.liked && <img id="like-img" src="./res/like-btn.png" alt="unlike" onClick={() => this.upvote(this.props.lightDex)}></img>}
                        {window.user && !this.state.liked && <img id="like-img" src="./res/not-liked.png" alt="like" onClick={() => this.upvote(this.props.lightDex)}></img>}
                    </div>}
                    <div id="preview-footer">
                        <div className="Trips_Wrapper">
                            <img id="trips-icon" src="./res/trips.png" alt="trips"></img>
                            <p>
                                {'Trips: ' + this.props.lights[this.props.lightDex].trips.length}
                            </p>
                        </div>
                    </div>
                    <div className="Preview_Controls">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + this.props.lights[this.props.lightDex].lat + ',' + this.props.lights[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" id="nav-img-preview" onClick={() => this.trip(this.props.lightDex)} /> &nbsp;</a>
                        <img id="exit-img" src="./res/close-preview.png" alt="back" onClick={this.unloadImg.bind(this)}></img>
                    </div>
                </div>}
                {this.props.lightDex !== -1 && this.props.contributions && <div className="Preview_Manager">
                    <img src={this.props.lights[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt={this.props.lights[this.props.lightDex].id} height={0} width={0}></img>
                    {this.state.loaded && <img src={this.props.lights[this.props.lightDex].url} id="preview-img" alt={this.props.lights[this.props.lightDex].id}></img>}
                    {!this.state.loaded && <Spinner />}
                    {this.state.loaded && <div className="Preview_Manager_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + this.props.lights[this.props.lightDex].lat + ',' + this.props.lights[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" id="nav-img-preview" /> &nbsp;</a>
                        <div id="stats">
                            <img id="upvotes-img" src="./res/upvotes.png" alt="upvotes"></img>
                            <p>
                                {this.props.lights[this.props.lightDex].upvotes.length}
                            </p>
                        </div>
                        <Contributor
                            contribution={this.props.lights[this.props.lightDex]}
                            unloadImg={this.unloadImg}
                        />
                    </div>}
                    <div className="Exit_Manager" onClick={this.unloadImg.bind(this)}>
                        <img id="exit-img-manager" src="./res/close-preview.png" alt="back"></img>
                    </div>
                </div>}
            </div>
        )
    }
}

export default Preview