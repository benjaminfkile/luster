import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import RadarAnimation from './RadarAnimation'
import Radar from '../Radar'
import '../Browse/Browse.css'

class Browse extends Component {

    lights = []

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            showFeed: true,
            radar: false,
            showSlider: false,
            maxDistance: 0,
            oldDistance: 10,
            sliderMax: 300,
        }
        this.handleSliderDrag = this.handleSliderDrag.bind(this);
    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 700)
        this.radarInterval = setInterval(this.listen4Radar, 1000)
        this.distanceInterval = setInterval(this.listen4DistanceChange, 1500)
    }

    listen4DB = () => {
        if (LightStore.length > 0) {
            clearInterval(this.dbInterval)
            this.setState({ db: true })
            this.lights = LightStore
        }
    }

    listen4Radar = () => {
        if (Radar.length > 0) {
            clearInterval(this.radarInterval)
            this.setState({ radar: true })
            this.filterByDistance(this.state.maxDistance)
        }
    }

    listen4DistanceChange = () => {
        if (this.state.oldDistance !== this.state.maxDistance) {
            this.filterByDistance(this.state.maxDistance)
        }
        if (this.lights.length === 0) {
            console.log('no nearby lights (from Browse.js)')
            this.setState({ maxDistance: this.state.maxDistance + 100, sliderMax: this.state.sliderMax + 100, showSlider: true})
        }
    }

    filterByDistance = async (miles) => {
        if (Radar.length > 0) {
            this.lights = []
            let temp = Radar.sort((a, b) => a[0] - b[0])
            for (let i = 0; i < temp.length; i++) {
                if (temp[i][0] < miles) {
                    this.lights.push(temp[i][1])
                    this.lights[i].distance = temp[i][0].toFixed(2)
                }
            }
            this.setState({ maxDistance: miles, oldDistance: miles })
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
        if (Radar.length > 0) {
            this.setState({ maxDistance: evt.target.value });
            this.lights = []
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
        // console.log(this.state)
        return (
            <div className="Browse" id="browse">
                {this.lights.length === 0 && <div className="Search_Radius">
                    <p>Search Radius {this.state.maxDistance} nm</p>
                </div>}
                {this.lights.length === 0 && <RadarAnimation />}
                {!this.state.showSlider && this.state.lightDex === -1 && <div className="Toggle_Slider" onClick={this.toggleSlider}>
                    <img id="distance-img" src="./res/distance.png" alt="oops"></img>
                </div>}
                {this.state.showSlider && this.state.lightDex === -1 && <div className="Slide_Container">
                    <p id="range-counter">Nearest Lights: ~ {this.state.maxDistance} nm ({this.lights.length}) results</p>
                    <br></br>
                    <input type="range" min="1" max={this.state.sliderMax} value={this.state.maxDistance} className="Slider" id="slider" onChange={this.handleSliderDrag}></input>
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
                                        <p id="distance">
                                            {img.distance} nm
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
                <Snow />
            </div>
        );
    }
}

export default Browse