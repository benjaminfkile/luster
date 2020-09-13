import React, { Component } from 'react'
import LazyLoad from 'react-lazyload';
import LightStore from '../LightStore'

class Browse extends Component {

    constructor() {
        super();
        this.state = {
            lightDex: -1,
            db: false
        }
    }

    componentDidMount() {
        this.dbInterval = setInterval(this.listen4DB, 100)
    }

    listen4DB = () => {
        if (LightStore.length > 0) {
            clearInterval(this.dbInterval)
            this.setState({db: true})
        }
    }

    toggleInterface = (args) => {
        this.setState({ lightDex: args })
    }

    render() {

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
            <div className="Browse">
                <div className="Img_Container">
                    {LightStore.map((img, i) =>
                        <LazyLoad
                            key={i}
                            height={300}>
                            {LightStore[i].flag === "0" && <div className="Light_Img" onClick={() => this.toggleInterface(i)}>
                                <img src={img.url} alt="oops" />
                                {/* <li>|||||||</li> */}
                                {i === this.state.lightDex &&
                                    <div className="Preview_Interface">
                                        <div className="Navlink">
                                            <a href={'https://www.google.com/maps/search/?api=1&query=' + LightStore[this.state.lightDex].lat + ',' + LightStore[this.state.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" width={40} /> &nbsp;</a>
                                        </div>
                                        {rating}
                                    </div>}
                            </div>}
                        </LazyLoad>)}
                </div>
            </div>
        );

    }
}

export default Browse