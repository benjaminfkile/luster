import React, { Component } from 'react'
import UrlStore from '../UrlStore'
import './Manager.css'

class Manager extends Component {
    constructor() {
        super();
        this.state = {
            on: true,
            off: false
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
        let targetUrl = UrlStore + '/api/users/validate/toggle/' + window.user
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

    valdel = () => {
        let targetUrl = UrlStore + '/api/users/validate/del/' + window.user
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
            })
        }).then(res => {
            if (res.status === 200) {
                console.log('deleted')
            }
            if (res.status === 403) {
                console.log("invalid")
            }

        })
        // return this.setState({ error: '' });
    }

    render() {

        return (
            <div className="Manager">
                {!this.state.on && <div className="On">
                    <p id="on" onClick={this.toggleSwitch}>Turn On</p>
                </div>}
                {!this.state.off && <div className="Off">
                    <p id="off" onClick={this.toggleSwitch}>Turn Off</p>
                </div>}
                <br></br>
                <br></br>
                <div className="Delete">
                    <p onClick={this.valdel}>Delete</p>

                </div>
            </div>
        )
    }
}

export default Manager