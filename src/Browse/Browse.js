import React, { Component } from 'react'
import VizAwareImg from '../Browse/VizAwareImg'
import LightStore from '../LightStore'



class Browse extends Component {

    render() {
        return (
            <div className="Img_Container">
                <div className="Light_Img">
                    {LightStore.slice(0,5).map((img) => <VizAwareImg src={img.url} key={Math.random()/Math.random()} />)}
                </div>
            </div>
        );
    }
}

export default Browse