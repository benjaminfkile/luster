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
            showSlider: true,
            maxDistance: 20,
            sliderMax: 1000,
            searchDistance: 0
        }
        this.handleSliderDrag = this.handleSliderDrag.bind(this);
    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 500)
        this.radarInterval = setInterval(this.listen4Radar, 500)
    }

    listen4DB = () => {
        if (LightStore.length > 0) {
            clearInterval(this.dbInterval)
            this.setState({ db: true })
            this.lights = LightStore
        }
        console.log(LightStore)
    }

    listen4Radar = () => {
        if (Radar.targets.length > 0) {
            clearInterval(this.radarInterval)
            this.filterByDistance(20)
        }
        console.log(Radar)
    }

    filterByDistance = (miles) => {
        clearInterval(this.searchIntevral)
        if (Radar.targets.length > 0) {
            this.lights = []
            for (let i = 0; i < Radar.targets.length; i++) {
                if (Radar.targets[i][0] < miles) {
                    this.lights.push(Radar.targets[i][1])
                    this.lights[i].distance = Radar.targets[i][0].toFixed(2)
                }
            }
            this.setState({ maxDistance: miles, oldDistance: miles })
        }
        if (this.lights.length === 0) {
            this.searchIntevral = setInterval(this.findClosest, 100)
        }
        console.log(miles)
    }

    findClosest = () => {
        this.setState({ searchDistance: this.state.searchDistance + 20, sliderMax: this.state.sliderMax + 20 })
        this.filterByDistance(this.state.searchDistance)
        if (this.lights.length > 0) {
            this.setState({ searchDistance: 0 })
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
        // this.setState({ showFeed: false })
        this.filterByDistance(evt.target.value)
    }

    // toggleSlider = () => {
    //     if (this.state.showSlider) {
    //         this.setState({ showSlider: false })
    //     } else {
    //         this.setState({ showSlider: true })
    //     }
    // }

    render() {

        console.log('render')
        console.log(this.state)

        return (
            <div className="Browse">
                {/* {this.lights.length === 0 && <RadarAnimation />} */}
                {this.lights.length === 0 && <Spinner />}
                <p id="range-info"> Lights less than {this.state.maxDistance} nm ({this.lights.length})</p>
                {/* <div className="Toggle_Slider" onClick={this.toggleSlider}>
                    {this.state.showSlider && <img id="toggle-slider-img" src="./res/close-slider.png" alt="oops" onClick={this.toggleSlider}></img>}
                    {!this.state.showSlider && <img id="toggle-slider-img" src="./res/open-slider.png" alt="oops" onClick={this.toggleSlider}></img>}
                </div> */}
                {this.state.showSlider && this.state.lightDex === -1 && <div className="Slider">
                    <input type="range" min="2" max={this.state.sliderMax} value={this.state.maxDistance} id="nested-slider" onChange={this.handleSliderDrag}></input>
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