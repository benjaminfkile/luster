import React, { Component } from 'react'
import UrlStore from '../UrlStore'
import GeoData from '../GeoData'
import LightStore from "../LightStore"
import Manager from '../Manager/Manager';
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
        for (let i = 0; i < LightStore[args].upvotes.length; i++) {
            if (LightStore[args].upvotes[i] === window.user) {
                this.setState({ liked: true, likes: LightStore[args].upvotes.length })
            }
        }
    }

    upvote = (args) => {
        if (window.user) {
            fetch(UrlStore + '/api/stats/upvote', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: LightStore[args].id,
                    userId: window.user
                })
            })
            LightStore[args].upvotes.push(window.user)
            this.setState({ liked: true, likes: LightStore[args].upvotes.length })
        }
    }

    trip = (args) => {
        if (GeoData.length > 0) {
            let user = ''
            if (window.user) {
                user += window.user + "@:" + Date.now()
            } else {
                user += GeoData[0].IPv4 + "@:" + Date.now()
            }
            fetch(UrlStore + '/api/stats/trip', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: LightStore[args].id,
                    ip: user
                })
            })
        }
    }

    handleImageLoaded = () => {
        if(!this.props.contributions){
            this.setState({ loaded: true, liked: false, likes: LightStore[this.props.lightDex].upvotes.length });
            this.upvoteHistory(this.props.lightDex)
        }else{
            this.setState({ loaded: true, liked: false})
        }
    }

    unloadImg = () => {
        this.setState({ loaded: false, liked: false })
        this.props.togglePreview(-1)
    }

    render() {
        return (
            <div>
                {this.props.lightDex !== -1 && !this.props.contributions && <div className="Preview">
                    <img src={LightStore[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt='hacky' height={0} width={0}></img>
                    {this.state.loaded && <img src={LightStore[this.props.lightDex].url} id="Preview_Img" alt='hacky'></img>}
                    {!this.state.loaded && <img src="./res/splash.png" id="Loading_Img" alt='A tree'></img>}
                    {this.state.loaded && <div className="Preview_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + LightStore[this.props.lightDex].lat + ',' + LightStore[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} onClick={() => this.trip(this.props.lightDex)} /> &nbsp;</a>
                        <div id="stats">
                            <img id="upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                            <p>
                                {this.state.likes}
                            </p>
                        </div>
                        {window.user && this.state.liked && <img id="like-img" src="./res/like-btn.png" alt="oops"></img>}
                        {window.user && !this.state.liked && <img id="like-img" src="./res/not-liked.png" alt="oops" onClick={() => this.upvote(this.props.lightDex)}></img>}

                        <p id="exit-btn" onClick={this.unloadImg.bind(this)}>
                            x
                        </p>
                    </div>}
                </div>}
                {this.props.lightDex !== -1 && this.props.contributions && <div className="Preview">
                    <img src={this.props.LightStore[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt='hacky' height={0} width={0}></img>
                    {this.state.loaded && <img src={this.props.LightStore[this.props.lightDex].url} id="Preview_Img" alt='hacky'></img>}
                    {!this.state.loaded && <img src="./res/splash.png" id="Loading_Img" alt='A tree'></img>}
                    {this.state.loaded && <div className="Preview_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + this.props.LightStore[this.props.lightDex].lat + ',' + this.props.LightStore[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} /> &nbsp;</a>
                        <div id="stats">
                            <img id="upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                            <p>
                                {this.props.LightStore[this.props.lightDex].upvotes.length}
                            </p>
                        </div>
                        <p id="exit-btn" onClick={this.unloadImg.bind(this)}>
                            x
                        </p>
                    </div>}
                    <Manager
                        contribution={this.props.LightStore[this.props.lightDex]}
                    />
                </div>}
            </div>
        )
    }
}

export default Preview