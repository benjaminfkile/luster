import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'

class Browse extends Component {

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            db: false,
            showFeed: true
        }
    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 100)
    }

    listen4DB = () => {
        if (LightStore.length > 0) {
            clearInterval(this.dbInterval)
            this.setState({ db: true })
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

    render() {

        console.log(this.state.showFeed)
        let rating = [];

        if (this.state.lightDex !== -1) {
            for (let i = 0; i < 5; i++) {
                if (i < LightStore[this.state.lightDex].upvotes) {
                    rating.push(
                        <img src="./res/star.png" alt="*" key={Math.random()}></img>
                    )
                }
            }
        }

        return (
            <div className="Browse" id="browse">
                <div className={this.state.showFeed ? 'Fade_In' : 'Fade_Out'} >
                    <div className="Img_Container">
                        {LightStore.map((img, i) =>
                            <LazyLoad
                                key={i}
                                height={0}>
                                {LightStore[i].flag === "0" && <div className="Light_Img" onClick={() => this.togglePreview(i)}>
                                    <img src={img.url} alt="oops" />
                                </div>}
                            </LazyLoad>)}
                    </div>
                </div>

                <Preview
                    togglePreview={this.togglePreview}
                    lightDex={this.state.lightDex}
                />
            </div>
        );

    }
}

export default Browse