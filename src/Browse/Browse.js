import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import '../Browse/Browse.css'

class Browse extends Component {

    lights = []

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            showFeed: true,
            sorted: false,
        }
    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 700)
    }

    listen4DB = () => {
        if (LightStore.length > 0) {
            clearInterval(this.dbInterval)
            this.setState({ db: true })
            this.maxDistance(46.83, -114.03)
        }
    }

    maxDistance = (latMax, lngMax) => {
        this.setState({ sorted: false })
        let a = LightStore
        for (let i = 0; i < a.length; i++) {
            if ((a[i].lat < latMax) && (a[i].lng < lngMax)) {
                this.lights.push(a[i])
            }
        }
        this.setState({ sorted: true })
        console.log(this.lights)

    }

    togglePreview = (args) => {
        if (this.state.showFeed) {
            this.setState({ showFeed: false })
        } else {
            this.setState({ showFeed: true })
        }
        this.setState({ lightDex: args })
    }

    render() {
        return (
            <div className="Browse" id="browse">
                <h1 id="browse-header">Browse</h1>
                {/* <div className="Sort">
                    <p>Distance</p>
                    <p>Likes</p>
                </div> */}
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