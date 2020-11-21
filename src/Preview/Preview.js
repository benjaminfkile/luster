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

    upvoteHistory = (args) => {
        for (let i = 0; i < this.props.lights[args].upvotes.length; i++) {
            if (this.props.lights[args].upvotes[i] === window.user) {
                this.setState({ liked: true, likes: this.props.lights[args].upvotes.length })
            }
        }
    }

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

    handleImageLoaded = () => {
        if (!this.props.contributions) {
            this.setState({ loaded: true, liked: false, likes: this.props.lights[this.props.lightDex].upvotes.length });
            this.upvoteHistory(this.props.lightDex)
        } else {
            this.setState({ loaded: true, liked: false })
        }
    }

    unloadImg = () => {
        this.setState({ loaded: false, liked: false })
        this.props.togglePreview(-1)
    }

    render() {

        if (this.props.lightDex !== -1) {
            console.log(this.props.lights[this.props.lightDex])
        }

        return (
            <div>
                {this.props.lightDex !== -1 && !this.props.contributions && <div className="Preview_User">
                    <img src={this.props.lights[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt='hacky' height={0} width={0}></img>
                    {this.state.loaded && <img src={this.props.lights[this.props.lightDex].url} id="preview-img" alt='hacky'></img>}
                    {/* {!this.state.loaded && <img src="./res/splash.png" id="preview-img" alt='A tree'></img>} */}
                    {!this.state.loaded && <Spinner />}
                    {this.state.loaded && <div className="Preview_User_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + this.props.lights[this.props.lightDex].lat + ',' + this.props.lights[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} onClick={() => this.trip(this.props.lightDex)} /> &nbsp;</a>
                        <div id="stats">
                            <img id="upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                            <p>
                                {this.state.likes}
                            </p>
                        </div>
                        {window.user && this.state.liked && <img id="like-img" src="./res/like-btn.png" alt="oops" onClick={() => this.upvote(this.props.lightDex)}></img>}
                        {window.user && !this.state.liked && <img id="like-img" src="./res/not-liked.png" alt="oops" onClick={() => this.upvote(this.props.lightDex)}></img>}

                    </div>}
                    <div className="Exit" onClick={this.unloadImg.bind(this)}>
                        <img id="exit-img" src="./res/close-preview.png" alt="oops"></img>
                        <div id="preview-footer">
                            <p>
                                {
                                    'Uploaded: '
                                    + new Date(parseInt(this.props.lights[this.props.lightDex].uploaded)).toLocaleDateString("en-US")
                                    + ' at '
                                    + new Date(parseInt(this.props.lights[this.props.lightDex].uploaded)).toLocaleTimeString("en-US")
                                }
                            </p>
                            <br></br>
                            <p>
                                {
                                    'Trips: '
                                    + this.props.lights[this.props.lightDex].trips.length
                                }
                            </p>
                        </div>
                    </div>
                </div>}
                {this.props.lightDex !== -1 && this.props.contributions && <div className="Preview_Manager">
                    <img src={this.props.lights[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt='hacky' height={0} width={0}></img>
                    {this.state.loaded && <img src={this.props.lights[this.props.lightDex].url} id="preview-img" alt='hacky'></img>}
                    {/* {!this.state.loaded && <img src="./res/splash.png" id="preview-img" alt='A tree'></img>} */}
                    {!this.state.loaded && <Spinner />}
                    {this.state.loaded && <div className="Preview_Manager_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + this.props.lights[this.props.lightDex].lat + ',' + this.props.lights[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} /> &nbsp;</a>
                        <div id="stats">
                            <img id="upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                            <p>
                                {this.props.lights[this.props.lightDex].upvotes.length}
                            </p>
                        </div>
                        <Contributor
                            contribution={this.props.lights[this.props.lightDex]}
                            unloadImg={this.unloadImg}
                        />
                    </div>}
                    <div className="Exit" onClick={this.unloadImg.bind(this)}>
                        <img id="exit-img-manager" src="./res/close-preview.png" alt="oops"></img>
                    </div>
                </div>}
            </div>
        )
    }
}

export default Preview