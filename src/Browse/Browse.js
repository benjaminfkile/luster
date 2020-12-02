import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import Spinner from '../Spinner/Spinner'
import Radar from '../Radar'
import Search from '../Search/Search'
import Map from '../Map/Map'
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
            search: false,
            loading: true,
            desktopImg: null,
            landscape: false
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

    componentWillUnmount() {
        this.browseMounted = false
    }

    listen4DB = () => {
        if (LightStore.lights.length > 0 && this.browseMounted) {
            clearInterval(this.dbInterval)
            this.lights = LightStore.lights
        }
    }

    listen4Radar = () => {
        if (Radar.targets.length > 0 && this.browseMounted) {
            this.setState({ target: Radar.targets[0][0] })
            clearInterval(this.radarInterval)
            this.filterByDistance(100)
        }
    }

    listen4SliderDrag = () => {
        this.setState({sliderDragged: false})
        if (this.state.maxDistance !== this.distance && this.browseMounted) {
            this.filterByDistance(this.distance)
        }
    }

    update = () => {
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

    scroll = () => {
        if (this.state.showFeed && this.scrollDex !== -1) {
            let item = document.getElementById(this.scrollDex)
            item.scrollIntoView(true)
            this.scrollDex = -1
        }
    }

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
        if (this.lights.length === 0) {
            this.findClosest()
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
            this.scrollDex = args
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
            if (this.state.lightDex !== -1) {
                this.togglePreview(-1)
                this.scrollDex = -1
            }
        }
    }

    handleSliderDrag(evt) {
        this.distance = evt.target.value
        this.setState({ showFeed: false, loading: true, sliderDragged: true })
    }

    render() {
        return (
            <div className="Browse">
                <Map />
                {!this.state.landscape && <div className="Browse_Mobile">
                    {this.state.loading && <Spinner />}
                    {LightStore.lights.length === 0 && <Search />}
                    {this.state.search && <Search toggled={true} />}
                    {this.lights.length > 0 && !this.state.search && <div className="Has_Location">
                        {this.state.showFeed && <p id="range-info"> Range: {this.state.maxDistance} mi | Results: {this.lights.length}</p>}
                        {this.state.lightDex === -1 && <div className="Slider">
                            <input type="range" min="2" max={this.state.sliderMax} value={this.state.maxDistance} id="nested-slider" onChange={this.handleSliderDrag}></input>
                        </div>}
                        {this.state.showFeed && <div className="Img_Container" id="img-container">
                            {this.lights.map((img, i) =>
                                <LazyLoad
                                    key={i}
                                    height={0}>
                                    {i % 2 === 0 && <div className="Even_Item" id={i}>
                                        <img src={img.url} alt="oops" onClick={() => this.togglePreview(i)} />
                                        <div id="browse-stats">
                                            <img id="browse-upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                                            <p>
                                                {img.upvotes.length}
                                            </p>
                                            <p id="distance">
                                                ~ {img.distance} mi
                                        </p>
                                        </div>
                                    </div>}
                                    {i % 2 !== 0 && <div className="Odd_Item" id={i}>
                                        <img src={img.url} alt="oops" onClick={() => this.togglePreview(i)} />
                                        <div id="browse-stats">
                                            <img id="browse-upvotes-img" src="./res/upvotes.png" alt="oops"></img>
                                            <p>
                                                {img.upvotes.length}
                                            </p>
                                            <p id="distance">
                                                ~ {img.distance} mi
                                        </p>
                                        </div>
                                    </div>}
                                </LazyLoad>)}
                        </div>}
                        {!this.state.search && <Preview
                            togglePreview={this.togglePreview}
                            lights={this.lights}
                            lightDex={this.state.lightDex}
                            contributions={false}
                        />}
                    </div>}
                </div>}
            </div>
        );
    }
}

export default Browse