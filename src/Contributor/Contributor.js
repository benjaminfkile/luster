import React, { Component } from 'react'
import api from '../api'
import './Contributor.css'

class Manager extends Component {
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
        let targetUrl = api + '/api/users/validate/toggle/' + window.user
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
        let targetUrl = api + '/api/users/validate/del/' + window.user
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
                this.props.unloadImg()
            }
            if (res.status === 403) {
                console.log("invalid")
            }

        })
    }

    confirmDel = () =>{
        if(this.state.del){
            this.setState({del: false})
        }else{
            this.setState({del: true})
        }
    }

    render() {

        console.log(this.props)

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
                <br></br>
                <div className="Delete" onClick={this.valdel}>
                <img id="del-img" src="./res/del.png" alt="oops" />
                    <p >Delete</p>
                </div>
            </div>
        )
    }
}

export default Manager