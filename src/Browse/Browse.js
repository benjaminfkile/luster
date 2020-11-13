import React, { Component } from 'react'
import Search from '../Search/Search'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import Spinner from '../Spinner/Spinner'
import Radar from '../Radar'
import { Link } from 'react-router-dom'
import '../Browse/Browse.css'

class Browse extends Component {

    lights = []
    distance = 20

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            showFeed: true,
            showSlider: true,
            maxDistance: 20,
            sliderMax: 200,
            searchDistance: 0,
            nag: false
        }
        this.handleSliderDrag = this.handleSliderDrag.bind(this);
    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 500)
        this.radarInterval = setInterval(this.listen4Radar, 500)
        this.distanceInterval = setInterval(this.listen4SliderDrag, 500)
    }

    listen4DB = () => {
        if (LightStore.length > 0) {
            clearInterval(this.dbInterval)
            //??
            this.setState({ db: true })
            this.lights = LightStore
        }
    }

    listen4Radar = () => {
        if (Radar.targets.length > 0) {
            clearInterval(this.radarInterval)
            this.filterByDistance(20)
        }
    }

    listen4SliderDrag = () => {
        if (this.state.maxDistance !== this.distance) {
            this.filterByDistance(this.distance)
        }
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
            this.setState({ maxDistance: miles, showFeed: true })
        }
        if (this.lights.length === 0) {
            this.searchIntevral = setInterval(this.findClosest, 100)
        }
    }

    findClosest = () => {
        this.setState({ searchDistance: this.state.searchDistance + 20, sliderMax: this.state.sliderMax + 20 })
        this.filterByDistance(this.state.searchDistance)
        this.distance = this.state.maxDistance
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

    toggleNag = () => {
        if (this.state.nag) {
            this.setState({ nag: false })
        } else {
            this.setState({ nag: true })
        }
    }

    handleSliderDrag(evt) {
        this.distance = evt.target.value
        this.setState({ showFeed: false })
    }

    render() {

        return (
            <div className="Browse">
                <div className="Search_Route">
                    <li>
                        <Link to='/search'>
                            <img id="search-pin" src='./res/pin.png' alt='hacky'></img>
                        </Link>
                    </li>
                </div>
                {this.lights.length === 0 && <Search />}
                {this.lights.length > 0 && <div className="Has_Location">
                    {this.lights.length === 0 && <Spinner />}
                    <p id="range-info"> Found {this.lights.length} within {this.state.maxDistance} miles.</p>
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
                                            {img.distance} mi
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
                </div>}
                {/* <Snow /> */}
            </div>
        );
    }
}

export default Browse