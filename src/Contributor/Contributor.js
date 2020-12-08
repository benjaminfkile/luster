import React, { Component } from 'react'
import ApiStore from '../ApiStore'
import './Contributor.css'

class Contributor extends Component {
    constructor() {
        super();
        this.state = {
            on: true,
            off: false,
            del: true
        }
    }

    componentDidMount() {
        if (this.props.contribution.on === 'f') {
            this.setState({ on: false, off: true })

        } else {
            this.setState({ on: true, off: false })
        }
    }

    toggleSwitch = () => {
        if (this.state.on) {
            this.setState({ on: false, off: true })
        } else {
            this.setState({ on: true, off: false })
        }
        this.valToggle()
    }

    valToggle = () => {
        let targetUrl = ApiStore + '/api/users/validate/toggle/' + window.user
        fetch(targetUrl, {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: window.user,
                id: this.props.contribution.id,
                pass: 'warm_b33r',
                on: this.props.contribution.on

            })
        }).then(res => {
            if (res.status === 200) {
                console.log('valid')
                if (this.props.contribution.on === 'f') {
                    this.props.contribution.on = 't'
                } else {
                    this.props.contribution.on = 'f'
                }

            }
            if (res.status === 403) {
                console.log('invalid')
            }
        })
        // return this.setState({ error: '' });
    }

    render() {

        return (
            <div className="Manager">
                {this.state.on && <div className="On" onClick={this.toggleSwitch}>
                <img id="on-img" src="./res/on.png" alt="oops" />
                    <p id="on" >On</p>
                </div>}
                {this.state.off && <div className="Off" onClick={this.toggleSwitch}>
                <img id="off-img" src="./res/off.png" alt="oops" />
                    <p id="off">Off</p>
                </div>}
            </div>
        )
    }
}

export default Contributor