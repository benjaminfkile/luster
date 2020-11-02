import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import Spinner from '../Spinner/Spinner'
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
            sliderMax: 100,
        }
        this.handleSliderDrag = this.handleSliderDrag.bind(this);
    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 700)
        this.radarInterval = setInterval(this.listen4Radar, 700)
        this.distanceInterval = setInterval(this.listen4DistanceChange, 200)
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
        // y u no build?
        if (this.state.oldDistance !== this.state.maxDistance) {
            this.filterByDistance(this.state.maxDistance)
        }
        if (this.lights.length === 0) {
            console.log('no nearby lights (from Browse.js)')
            this.setState({ maxDistance: this.state.maxDistance + 20, sliderMax: this.state.sliderMax + 20, showSlider: true })
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
        console.log(evt.target.value)
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
        return (
            <div className="Browse">
                {/* <RadarAnimation/> */}
                {this.lights.length === 0 && <Spinner />}
                <p id="range-info"> Lights less than {this.state.maxDistance} nm ({this.lights.length})</p>
                <div className="Toggle_Slider" onClick={this.toggleSlider}>
                    {this.state.showSlider && <img id="toggle-slider-img" src="./res/close-slider.png" alt="oops" onClick={this.toggleSlider}></img>}
                    {!this.state.showSlider && <img id="toggle-slider-img" src="./res/open-slider.png" alt="oops" onClick={this.toggleSlider}></img>}
                </div>
                {this.state.showSlider && this.state.lightDex === -1 && <div className="Slider">
                    <input type="range" min="5" max={this.state.sliderMax} value={this.state.maxDistance} id="nested-slider" onChange={this.handleSliderDrag}></input>
                </div>}
                {this.state.showFeed && <div className="Img_Container">
                    {this.lights.map((img, i) =>
                        <LazyLoad
                            key={i}
                            height={0}>
                            <div className="Item">
                                <img src={img.url} alt="oops" onClick={() => this.togglePreview(i)} />
                                <div id="browse-stats">
                                    <img id="browse-upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                                    <p>
                                        {img.upvotes.length}
                                    </p>
                                    <p id="distance">
                                        {img.distance} nm
                                        </p>
                                </div>
                            </div>
                        </LazyLoad>)}
                </div>}
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