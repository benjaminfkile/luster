import React, { Component } from 'react'
import api from '../api'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import Register from '../Register/Register'
import './Profile.css'

let contribs = []

class Profile extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: '',
            register: false,
            loggedIn: false,
            hasContribs: false,
            showFeed: true,
            lightDex: -1
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
    }

    componentDidMount() {
        if (window.user) {
            this.setState({ loggedIn: true })
        }
        contribs = []
        this.interval = setInterval(this.listen4User, 1000)
    }

    listen4User = () => {
        if (window.user) {
            this.getContributions()
            clearInterval(this.interval)
        }
    }

    getContributions = () => {
        let targetUrl = api + '/api/lights/contributor/' + window.user
        fetch(targetUrl)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    contribs.push(data[i])
                    let date = new Date(parseInt(data[0].uploaded)).toLocaleDateString("en-US")
                    var time = new Date(parseInt(data[0].uploaded)).toLocaleTimeString("en-US")
                    let timestamp = date + " at " + time
                    contribs[i].uploaded = timestamp
                }
            }).then(() =>
                this.renderContributions())
            .catch(error => alert('Sorry the service is down \n:(\nPlease try asadfsdfsdafsadfsadfasdfgain later'));
    }

    renderContributions = () => {
        if (contribs.length > 0) {
            this.setState({ hasContribs: true })
        } else {
            this.setState({ hasContribs: false })
        }
    }

    dismissError() {
        this.setState({ error: '' });
    }

    handleSubmit(evt) {
        evt.preventDefault();

        if (!this.state.email) {
            return this.setState({ error: 'Email is required' });
        }

        if (!this.state.password) {
            return this.setState({ error: 'Password is required' });
        }
        fetch(api + '/api/users/validate', {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                pass: this.state.password
            })
        }).then(res => {
            if (res.status === 200) {
                this.setState({ loggedIn: true })
                //window.user = this.state.email
                this.setName(this.state.email)
            }
            if (res.status === 202) {
                this.setState({ loggedIn: false })
                return this.setState({ error: 'User not registered' });
            }
            if (res.status === 403) {
                this.setState({ loggedIn: false })
                return this.setState({ error: 'Invalid Credentials' });
            }

        })
        return this.setState({ error: '' });
    }

    setName = () => {
        let targetUrl = api + '/api/users/' + this.state.email;
        fetch(targetUrl)
            .then(response => response.json())
            .then(data => {
                window.user = data.id
                window.name = data.name
            })
    }

    logOut = () => {
        window.user = null
        this.setState({ loggedIn: false, email: '', password: '' })
    }

    handleUserChange(evt) {
        this.setState({
            email: evt.target.value,
        });
    };

    handlePassChange(evt) {
        this.setState({
            password: evt.target.value,
        });
    }

    register = (args) => {

        if (args === 1) {
            this.setState({ register: false })
        } else {
            this.setState({ register: true })
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
            <div className="Login">
                {this.state.loggedIn && <div className="Profile">
                    <h1>Hi {window.name}</h1>
                    <button onClick={this.logOut}>Log Out</button>
                    {this.state.hasContribs && <h3>
                        Your Contributions({contribs.length})
                    </h3>}
                    {this.state.hasContribs && this.state.showFeed && <div className="Contribs_Container">
                            {contribs.map((img, i) =>
                                <LazyLoad
                                    key={i}
                                    height={0}>
                                    <div className="Contrib_Item" onClick={() => this.togglePreview(i)}>
                                        <img src={img.url} alt="oops" />
                                        <div id="contrib-stats">
                                            <div id="upvote-section">
                                                <img id="contrib-stats-upvote" src="./res/upvotes.png" alt="oops"></img>
                                                <p>
                                                    {img.upvotes.length}
                                                </p>
                                            </div>
                                            <div id="trip-section">
                                                <img id="contrib-stats-trips" src="./res/navi-btn.png" alt="oops"></img>
                                                <p>
                                                    {img.trips.length}
                                                </p>
                                            </div>
                                            {img.on === "t" && <div id="on-section">
                                                <img id="contrib-stats-on" src="./res/on.png" alt="oops"></img>
                                                <p>On</p>
                                            </div>}
                                            {img.on === "f" && <div id="off-section">
                                                <img id="contrib-stats-off" src="./res/off.png" alt="oops"></img>
                                                <p>Off</p>
                                            </div>}
                                            <br></br>
                                            <p>
                                                {img.uploaded}
                                            </p>
                                        </div>
                                    </div>
                                </LazyLoad>)}
                        </div>}
  
                    <Preview
                        togglePreview={this.togglePreview}
                        lightDex={this.state.lightDex}
                        contributions={true}
                        lights={contribs}
                    />
                </div>}
                {!this.state.register && !this.state.loggedIn && <form className="LoginForm" id="login-form" onSubmit={this.handleSubmit}>
                    <h1>
                        Log In
                    </h1>
                    <label>Email</label>
                    <br></br>
                    <input type="text" value={this.state.email} onChange={this.handleUserChange} />
                    <br></br>
                    <label>Password</label>
                    <br></br>
                    <input type="password" value={this.state.password} onChange={this.handlePassChange} />
                    <br></br>
                    <br></br>
                    <input type="submit" value="Log In" />
                    <br></br>
                    <br></br>
                    <button id="register-btn" onClick={this.register}>Register</button>
                </form>}
                {this.state.register &&
                    <Register
                        register={this.register}
                    />}
                <br></br>
                {this.state.error &&
                    <h3 onClick={this.dismissError}>
                        <button onClick={this.dismissError}>✖</button>
                        {this.state.error}
                    </h3>}
            </div>
        );
    }
}

export default Profile