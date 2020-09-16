import React, { Component } from 'react'
import LightStore from "../LightStore"
import './Preview.css'
import '../Browse/Browse.css'

class Preview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    handleImageLoaded = () => {
        this.setState({ loaded: true });
    }

    unloadImg = () => {
        this.setState({ loaded: false })
        this.props.togglePreview(-1)
    }

    render() {

        if (this.props.lightDex !== -1) {
            console.log(LightStore[this.props.lightDex])
        }

        return (
            <div>
                {this.props.lightDex !== -1 && <div className="Preview">
                    <img src={LightStore[this.props.lightDex].url} onLoad={this.handleImageLoaded.bind(this)} alt='hacky' height={0} width={0}></img>
                    {this.state.loaded && <img src={LightStore[this.props.lightDex].url} id="Preview_Img" alt='hacky'></img>}
                    {!this.state.loaded && <img src="./res/splash.png" id="Loading_Img" alt='A tree'></img>}
                    {!this.state.loaded && <h1>Loading...</h1>}
                    {this.state.loaded && <section className="Preview_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + LightStore[this.props.lightDex].lat + ',' + LightStore[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} /> &nbsp;</a>
                        <p id="preview-upvotes">
                            <img src="./res/likes.png" alt='likes'></img>
                            {LightStore[this.props.lightDex].upvotes}
                            
                        </p>
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

