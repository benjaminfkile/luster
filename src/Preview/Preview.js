import React, { Component } from 'react'
import LightStore from "../LightStore"
import './Preview.css'
import '../Browse/Browse.css'

class Preview extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        let rating = [];
        if (this.props.lightDex !== -1) {
            for (let i = 0; i < 5; i++) {
                if (i < LightStore[this.props.lightDex].rating) {
                    rating.push(
                        <img src="./res/star.png" alt="*" height="30" width="30" key={Math.random()}></img>
                    )
                }
            }
        }


        console.log(LightStore)

        return (
            <div>
                {this.props.lightDex !== -1 && <div className="Preview">
                    <img src={LightStore[this.props.lightDex].url} id="Preview_Img" alt='hacky'></img>
                    {rating}
                    <section id="Preview_Interface">
                        <a href={'https://www.google.com/maps/search/?api=1&query=' + LightStore[this.props.lightDex].lat + ',' + LightStore[this.props.lightDex].lng} target="_blank" rel="noopener noreferrer"><img src="./res/navi-btn.png" alt="Directions" height={50} width={50} /> &nbsp;</a>
                        <br></br>
                        <p onClick={() => this.props.togglePreview(-1)}>x</p>
                    </section>

                </div>}
            </div>
        )
    }
}

export default Preview

