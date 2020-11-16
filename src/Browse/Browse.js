import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import Spinner from '../Spinner/Spinner'
import Radar from '../Radar'
import Search from '../Search/Search'
import '../Browse/Browse.css'

class Browse extends Component {

    lights = []
    distance = 20
    browseMounted = false

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            showFeed: true,
            showSlider: true,
            maxDistance: 20,
            sliderMax: 200,
            searchDistance: 0,
            search: false,
            target: null,
            loading: true
        }
        this.handleSliderDrag = this.handleSliderDrag.bind(this);
    }

    componentDidMount() {
        this.browseMounted = true
        this.dbInterval = setInterval(this.listen4DB, 500)
        this.radarInterval = setInterval(this.listen4Radar, 500)
        this.distanceInterval = setInterval(this.listen4SliderDrag, 500)
        this.queryInterval = setInterval(this.listenForQuery, 500)
    }

    componentWillUnmount() {
        this.browseMounted = false
    }

    listen4DB = () => {
        if (LightStore.length > 0 && this.browseMounted) {
            clearInterval(this.dbInterval)
            this.lights = LightStore
        }
    }

    listen4Radar = () => {
        if (Radar.targets.length > 0 && this.browseMounted) {
            this.setState({ target: Radar.targets[0][0] })
            clearInterval(this.radarInterval)
            this.filterByDistance(20)
        }
    }

    listen4SliderDrag = () => {
        if (this.state.maxDistance !== this.distance && this.browseMounted) {
            this.filterByDistance(this.distance)
        }
    }

    listenForQuery = () => {
        if (this.state.target && this.state.target !== Radar.targets[0][0] && this.browseMounted) {
            this.setState({ target: Radar.targets[0][0], search: false })
            this.filterByDistance(20)
        }
    }

    filterByDistance = (miles) => {
        clearInterval(this.searchIntevral)
        this.setState({loading: true})
        if (Radar.targets.length > 0) {
            this.lights = []
            for (let i = 0; i < Radar.targets.length; i++) {
                if (Radar.targets[i][0] < miles) {
                    this.lights.push(Radar.targets[i][1])
                    this.lights[i].distance = Radar.targets[i][0].toFixed(2)
                }
            }
            this.setState({ maxDistance: miles })
        }
        if (this.lights.length === 0) {
            this.searchIntevral = setInterval(this.findClosest, 500)
        } else {
            this.setState({ showFeed: true, loading: false })
        }
    }

    findClosest = () => {
        this.setState({ searchDistance: this.state.searchDistance + 20, sliderMax: this.state.sliderMax + 20, loading: true })
        this.filterByDistance(this.state.searchDistance)
        this.distance = this.state.maxDistance
        if (this.lights.length > 0) {
            this.setState({ searchDistance: 0, loading: false })
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

    toggleSearch = () => {
        if (this.state.search) {
            this.setState({ search: false })
        } else {
            this.setState({ search: true })
        }
    }

    handleSliderDrag(evt) {
        this.distance = evt.target.value
        this.setState({ showFeed: false, loading: true })
    }

    render() {

        console.log('Browse rendered')


        return (
            <div className="Browse">
                {this.state.loading && <Spinner />}
                {LightStore.length === 0 && <Search />}
                {this.state.search && <Search toggled={true} />}
                {this.lights.length > 0 && !this.state.search && <div className="Has_Location">
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
                    {!this.state.search && <Preview
                        togglePreview={this.togglePreview}
                        lights={this.lights}
                        lightDex={this.state.lightDex}
                        contributions={false}
                    />}
                </div>}
                <div className="Search_Toggle">
                    <img src="./res/pin.png" alt="oops" onClick={this.toggleSearch}></img>
                </div>
            </div>
        );
    }
}

export default Browse