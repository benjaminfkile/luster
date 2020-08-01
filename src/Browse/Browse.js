import React, { Component } from 'react'
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'
import Preview from '../Preview/Preview'

class Browse extends Component {

    constructor() {
        super();
        this.state = {
            showPreview: false,
            lightDex: -1
        }
    }

    toggleInterface = (args) => {
        // if (this.state.showPreview) {
        //     this.setState({ showPreview: false, lightDex: -1 })
        // } else {
        //     this.setState({ showPreview: true })
        //     this.setState({ lightDex: args })
        // }
        this.setState({ lightDex: args })
    }


    render() {

        console.log(this.state.lightDex)
        let rating = [];

        if (this.state.lightDex !== -1) {
            for (let i = 0; i < 5; i++) {
                if (i < LightStore[this.state.lightDex].rating) {
                    rating.push(
                        <img src="./res/star.png" alt="*" key={Math.random()}></img>
                    )
                }
            }
        }
        return (
            <div className="Browse">
                <div className="Img_Container">
                    {LightStore.map((img, i) =>
                        <LazyLoad
                            key={i}
                            height={300}>
                            <div className="Light_Img" onClick={() => this.toggleInterface(i)}>
                                <img src={img.url} alt="oops" />
                                {i === this.state.lightDex &&
                                    <div className="Preview_Interface">
                                        <div className="Navlink">
                                            <a href={'https://www.google.com/maps/search/?api=1&query=' + LightStore[this.state.lightDex].lat + ',' + LightStore[this.state.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" width={40} /> &nbsp;</a>
                                        </div>
                                        {rating}
                                    </div>}
                            </div>
                        </LazyLoad>)}
                </div>
            </div>
        );

    }
}

export default Browse