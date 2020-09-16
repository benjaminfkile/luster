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
            showFeed: true,
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
        console.log(LightStore)


        return (
            <div className="Browse" id="browse">
                <div className={this.state.showFeed ? 'Fade_In' : 'Fade_Out'} >
                    <div className="Img_Container">
                        {LightStore.map((img, i) =>
                            <LazyLoad
                                key={i}
                                height={30}>
                                {LightStore[i].flag === "0" && <div className="Light_Img" onClick={() => this.togglePreview(i)}>
                                    <img src={img.url} alt="oops" />
                                </div>}
                                <ul id="stats">
                                        <li>
                                        <img id="upvote-img" src="./res/likes.png" alt="*" key={i}></img>
                                        </li>
                                        <li id="upvotes">
                                            {LightStore[i].upvotes}
                                        </li>
                                    </ul>
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