import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import Spinner from '../Spinner/Spinner'
import Radar from '../Radar'
import Location from '../Location'
import Search from '../Search/Search'
import Map from '../Map/Map'
import Snow from '../Snow/Snow'
import '../Browse/Browse.css'

class Browse extends Component {

    lights = []
    distance = 100
    scrollDex = -1

    browseMounted = false

    constructor(props) {
        super(props);
        this.state = {
            lightDex: -1,
            showFeed: true,
            maxDistance: 100,
            sliderMax: 200,
            searchDistance: 0,
            loading: true,
        }
        this.handleSliderDrag = this.handleSliderDrag.bind(this);
    }

    componentDidMount() {
        this.browseMounted = true
        this.dbInterval = setInterval(this.listen4DB, 500)
        this.radarInterval = setInterval(this.listen4Radar, 500)
        this.sliderInterval = setInterval(this.listen4SliderDrag, 300)
        this.updateInterval = setInterval(this.update, 500)
        this.scrollInterval = setInterval(this.scroll, 500)
    }

    //clear remaning intervals when unmounting
    componentWillUnmount() {
        this.browseMounted = false
        clearInterval(this.sliderInterval)
        clearInterval(this.updateInterval)
        clearInterval(this.scrollInterval)
    }

    //waits for a respose from the API
    listen4DB = () => {
        if (LightStore.lights.length > 0 && this.browseMounted) {
            clearInterval(this.dbInterval)
            this.lights = LightStore.lights
        }
    }
    //waits untill Radar.js has ran everything through the halversine function
    listen4Radar = () => {
        if (Radar.targets.length > 0 && this.browseMounted) {
            this.setState({ target: Radar.targets[0][0] })
            clearInterval(this.radarInterval)
            this.filterByDistance(100)
        }
    }
    //listens for when the user drags the slider and calls filterByDistance()
    listen4SliderDrag = () => {
        this.setState({ sliderDragged: false })
        if (this.state.maxDistance !== this.distance && this.browseMounted) {
            this.filterByDistance(this.distance)
        }
    }

    update = () => {
        if (!Location.coords.lat) { //if the user denies there location and lands on the page in the Browse route somehow redirect them to the map route so they can manually choose a location
            window.location.href = '/map';
        } else {
            //if the update Array in LightStore.js has a 1 in it, then the user changed there location so empty this.lights, reset Radar targets and call filterByDistance() again
            if (LightStore.update.length > 0 && this.browseMounted) {
                for (let i = 0; i < LightStore.update.length; i++) {
                    if (LightStore.update[i] === 1) {
                        this.lights = LightStore.lights
                        this.setState({ target: Radar.targets[0][0], maxDistance: 20, search: false })
                        this.filterByDistance(100)
                    }
                }
            }
        }
    }
    //scroll to the last image the user clicked
    scroll = () => {
        if (this.state.showFeed && this.scrollDex !== -1) {
            let item = document.getElementById(this.scrollDex)
            item.scrollIntoView(true)
            this.scrollDex = -1
        }
    }
    //filters the lights by distance based on the slider value
    filterByDistance = (miles) => {
        this.setState({ loading: true })
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
        if (this.lights.length < 12) {
            //if no lights are found call findClosest()
            this.findClosest()
        } else {
            this.setState({ showFeed: true, loading: false })
        }
    }
    //increases the maxDistance if no lights are found
    findClosest = () => {
        this.setState({ searchDistance: this.state.searchDistance + 20, sliderMax: this.state.sliderMax + 20, loading: true })
        this.filterByDistance(this.state.searchDistance)
        this.distance = this.state.maxDistance
        if (this.lights.length > 0) {
            this.setState({ searchDistance: 0, loading: false })
        }
    }
    //when lightDex is -1 (in Preview.js), the preview will show, when its not -1 the preview wont show and the state will be changed to show the feed
    togglePreview = (args) => {
        if (this.state.showFeed) {
            this.scrollDex = args
            this.setState({ showFeed: false })
        } else {
            this.setState({ showFeed: true })
        }
        this.setState({ lightDex: args })
    }
    //sets this.distance to the value from the onChange event
    handleSliderDrag(evt) {
        this.distance = evt.target.value
        this.setState({ showFeed: false, loading: true, sliderDragged: true })
    }

    render() {

        return (
            <div className="Browse">
                {/*The Map and Snow components just for looks in Browse*/}
                <Map />
                <Snow />
                {this.state.loading && <Spinner />}
                {/*Search is never used in browse but (for now) needs to mounted if the user doesnt allow there location(check the update() method)*/}
                {LightStore.lights.length === 0 && <Search />}
                {this.lights.length > 0 && <div className="Has_Location">
                    {this.state.showFeed && <p id="range-info"> Range: {this.state.maxDistance} NM | Results: {this.lights.length}</p>}
                    {this.state.lightDex === -1 && <div className="Slider">
                        <input type="range" min="2" max={this.state.sliderMax} value={this.state.maxDistance} id="nested-slider" onChange={this.handleSliderDrag}></input>
                    </div>}
                    {this.state.showFeed && <div className="Img_Container" id="img-container">
                        {this.lights.map((img, i) =>
                            <LazyLoad
                                key={i}
                                height={0}>
                                {/*creating even or odd className for animations, Evens will slide in right, odds slide in left*/}
                                {i % 2 === 0 && <div className="Even_Item" id={i}>
                                    <img src={img.url} alt={img.id} onClick={() => this.togglePreview(i)} />
                                    <div id="browse-stats">
                                        <img id="browse-upvotes-img" src="./res/upvotes.png" alt="upvote"></img>
                                        <p>
                                            {img.upvotes.length}
                                        </p>
                                        <p id="distance">
                                            {img.distance} nm
                                        </p>
                                    </div>
                                </div>}
                                {i % 2 !== 0 && <div className="Odd_Item" id={i}>
                                    <img src={img.url} alt={img.id} onClick={() => this.togglePreview(i)} />
                                    <div id="browse-stats">
                                        <img id="browse-upvotes-img" src="./res/upvotes.png" alt="upvote"></img>
                                        <p>
                                            {img.upvotes.length}
                                        </p>
                                        <p id="distance">
                                            {img.distance} nm
                                        </p>
                                    </div>
                                </div>}
                            </LazyLoad>)}
                    </div>}
                    <Preview
                        togglePreview={this.togglePreview /*callback from Preview to show the feed again*/}
                        lights={this.lights/*pass the lights  to Preview so it can load the image*/}
                        lightDex={this.state.lightDex/*pass the lightDex to Preview*/}
                        contributions={false/*Preview needs to know weather the user is trying to preview the lights in the Profile component, or in the Browse component*/}
                    />
                </div>}
            </div>
        );
    }
}

export default Browse