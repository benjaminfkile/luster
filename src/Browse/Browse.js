import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import Radar from '../Radar'
import '../Browse/Browse.css'

class Browse extends Component {

    lights = []

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            showFeed: true,
            sorted: false,
            radar: false,
            showSlider: false,
            maxDistance: 10,
        }
        this.handleSliderDrag = this.handleSliderDrag.bind(this);

    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 700)
        this.radarInterval = setInterval(this.listen4Radar, 700)

    }

    listen4DB = () => {
        if (LightStore.length > 0) {
            clearInterval(this.dbInterval)
            this.setState({ db: true })
            this.lights = LightStore
        }
    }

    listen4Radar = () => {
        console.log('listening 4 radar')
        if (Radar.length > 0) {
            clearInterval(this.radarInterval)
            this.setState({ radar: true })
            this.pruneByDistance(this.state.maxDistance)
        }
    }

    pruneByDistance = async (miles) => {
        if (Radar.length > 0) {
            this.lights = []
            let temp = Radar.sort((a, b) => a[0] - b[0])
            for (let i = 0; i < temp.length; i++) {
                if (temp[i][0] < miles) {
                    this.lights.push(temp[i][1])
                }
            }
            console.log(temp)
            this.setState({ maxDistance: miles })
        }
    }

    togglePreview = (args) => {
        if (this.state.showFeed) {
            this.setState({ showFeed: false })
        } else {
            this.setState({ showFeed: true })
        }
        this.setState({ lightDex: args })
    }

    handleSliderDrag(evt) {
        // this.setState({ maxDistance: evt.target.value });
        if (Radar.length > 0) {
            this.pruneByDistance(evt.target.value)
        }
    }

    toggleSlider = () => {
        if (this.state.showSlider) {
            this.setState({ showSlider: false })
        } else {
            this.setState({ showSlider: true })
        }
    }

    render() {

        console.log(this.state.sliderValue)
        return (
            <div className="Browse" id="browse">
                {!this.state.showSlider && <div className="Toggle_Slider" onClick={this.toggleSlider}>
                <img id="distance-img" src="./res/distance.png" alt="oops"></img>
                </div>}
                {this.state.showSlider && <div className="Slide_Container">
                    <p>Range: {this.state.maxDistance} miles</p>
                    <br></br>
                    <input type="range" min="1" max="100" value={this.state.maxDistance} className="Slider" id="slider" onChange={this.handleSliderDrag}></input>
                    {this.state.showSlider && <img id="close-slider-img" src="./res/close-slider.png" alt="oops" onClick={this.toggleSlider}></img>}
                </div>}
                <div className={this.state.showFeed ? 'Fade_In' : 'Fade_Out'} >
                    <div className="Img_Container">
                        {this.lights.map((img, i) =>
                            <LazyLoad
                                key={i}
                                height={0}>
                                <div className="Item">
                                    <img src={img.url} alt="oops" onClick={() => this.togglePreview(i)} />
                                    <div id="stats">
                                        <img id="upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                                        <p>
                                            {img.upvotes.length}
                                        </p>
                                    </div>

                                </div>
                            </LazyLoad>)}
                    </div>
                </div>
                <Preview
                    togglePreview={this.togglePreview}
                    lights={this.lights}
                    lightDex={this.state.lightDex}
                    contributions={false}
                />
                {this.state.lightDex !== -1 && <Snow />}
            </div>
        );
    }
}

export default Browse