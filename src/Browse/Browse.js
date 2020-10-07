import React, { Component } from 'react'
import Preview from "../Preview/Preview"
import Snow from '../Snow/Snow'
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import '../Browse/Browse.css'

class Browse extends Component {

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            db: false,
            showFeed: true,
            render: true
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
        return (
            <div className="Browse" id="browse">
                <div className={this.state.showFeed ? 'Fade_In' : 'Fade_Out'} >
                    <div className="Img_Container">
                        {LightStore.map((img, i) =>
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
                    lightDex={this.state.lightDex}
                />
                {this.state.lightDex !== -1 && <Snow />}
            </div>
        );
    }
}

export default Browse