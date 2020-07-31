import React, { Component } from 'react';
import VizSensor from 'react-visibility-sensor';

class VizAwareImg extends Component {
  state = {
    imgViz: false
  }

  render() {

    return (
      <VizSensor
        onChange={(isVisible) => {
          this.setState({imgViz: isVisible})
        }}
      >
        <img
          src={this.props.src}
          style={{
            opacity: this.state.imgViz ? 1 : 0.5,
            transition: 'opacity 500ms linear',

          }}
        />
      </VizSensor>
    );
  }
}

export default VizAwareImg