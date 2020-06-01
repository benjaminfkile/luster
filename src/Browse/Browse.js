import React, { Component } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LightStore from '../LightStore'
import '../Browse/Browse.css'

class Browse extends Component {

    dbInterval
    navLink = 'https://www.google.com/maps/search/?api=1&query='

    constructor() {
        super();
        this.state = {
            lights: null,
            showPreview: false,
            previewData: null,
            rating: ["*"]
        }
    }

    componentDidMount() {
        this.randomize(LightStore[0])
        // this.listen4DB()
    }

    listen4DB = () => {
        if (LightStore[0].length > 0) {
            this.randomize(LightStore[0])
        }
    }

    preview = (args) => {

        if (this.state.showPreview) {
            this.setState({ showPreview: false })
        }
        else {
            this.setState({ showPreview: true, previewData: args })
        }
        if (args) {
            let temp = []
            for (let i = 0; i < args.rating; i++) {
                temp.push("*")
            }
            this.setState({ rating: temp })
        }
    }

    showPreview = () => {
        this.setState({ showPreview: true })
    }

    hidePreview = () => {
        this.setState({ showPreview: false })
    }

    //Fisher-Yates Shuffling Algorithm
    randomize = (arr) => {
        var i,
            j,
            temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        this.setState({ lights: arr })
    }

    render() {

        let lights = this.state.lights
        let rating = []
        for (let i = 0; i < this.state.rating.length; i++) {
            rating.push(
                <img src="../res/star.png" alt="*" height="30" width="30" key={Math.random()}></img>
            )
        }

        console.log(lights)

        return (
            <div className="Browse">
                {!this.state.showPreview && <div className="Light_List">
                    {lights && lights.map(light => <div className="Image_Container" key={Math.random() * Math.random()}>
                        <LazyLoadImage
                            alt="oops"
                            src={light.url}
                            onClick={() => this.preview(light)}
                        />
                    </div>)}
                </div>}
                {this.state.showPreview && <div className="Show_Preview">
                    {this.state.previewData && <LazyLoadImage
                        alt="oops"
                        src={this.state.previewData.url}
                        onClick={() => this.preview(this.state.previewData.rating)}
                    />}

                </div>}
                {/* make this its own component */}
                {this.state.showPreview && <div className="Light_Info">
                    <div className="Stars">
                        {rating}
                    </div>
                    <div className="Nav_Link">
                        <a href={this.navLink + this.state.previewData.lng + ',' + this.state.previewData.lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" /> &nbsp;</a>
                    </div>

                </div>}
            </div>
        )
    }

}

export default Browse