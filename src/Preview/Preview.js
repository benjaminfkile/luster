import React, { Component } from 'react'
import LightStore from "../LightStore"
import './Preview.css'

class Preview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            liked: false,
            likes: 0
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
            fetch('https://agile-wildwood-40014.herokuapp.com/api/upvote', {
            // fetch('http://localhost:8000/api/upvote', {

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
            this.setState({liked: true, likes: LightStore[args].upvotes.length})
        }
    }

    handleImageLoaded = () => {
        this.setState({ loaded: true, liked: false, likes: LightStore[this.props.lightDex].upvotes.length });
        this.upvoteHistory(this.props.lightDex)
    }

    unloadImg = () => {
        this.setState({ loaded: false, liked: false })
        this.props.togglePreview(-1)
    }

    render() {

        return (
            <div>
                {this.props.lightDex !== -1 && <div className="Preview">
                    <img src={LightStore[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt='hacky' height={0} width={0}></img>
                    {this.state.loaded && <img src={LightStore[this.props.lightDex].url} id="Preview_Img" alt='hacky'></img>}
                    {!this.state.loaded && <img src="./res/splash.png" id="Loading_Img" alt='A tree'></img>}
                    {/* {!this.state.loaded && <h1>Loading...</h1>} */}
                    {this.state.loaded && <section className="Preview_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + LightStore[this.props.lightDex].lat + ',' + LightStore[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} /> &nbsp;</a>
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
                    </section>}
                </div>}
            </div>
        )
    }
}

export default Preview

