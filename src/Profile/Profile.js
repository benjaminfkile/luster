import React, { Component } from 'react'
import api from '../api'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import Register from '../Register/Register'
import './Profile.css'


class Profile extends Component {

    contribs = []

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
        this.contribs = []
        this.interval = setInterval(this.listen4User, 1000)
    }

    componentWillUnmount() {
        this.contribs = []
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
                    this.contribs.push(data[i])
                    let date = new Date(parseInt(data[0].uploaded)).toLocaleDateString("en-US")
                    var time = new Date(parseInt(data[0].uploaded)).toLocaleTimeString("en-US")
                    let timestamp = date + " at " + time
                    this.contribs[i].uploaded = timestamp
                }
            }).then(() =>
                this.renderContributions())
            .catch(error => alert('Sorry the service is down \n:(\nPlease try asadfsdfsdafsadfsadfasdfgain later'));
    }

    renderContributions = () => {
        if (this.contribs.length > 0) {
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
            return this.setState({ error: ' Email is required' });
        }

        if (!this.state.password) {
            return this.setState({ error: ' Password is required' });
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
                return this.setState({ error: ' User not registered' });
            }
            if (res.status === 403) {
                this.setState({ loggedIn: false })
                return this.setState({ error: ' Invalid Credentials' });
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
                    <div id="logout-btn" onClick={this.logOut}>
                        <img id="logout-img" src="./res/logout.png" alt="oops"></img>
                        <p>Logout</p>
                    </div>
                    {this.state.hasContribs && <h3>
                        Your Contributions ( {this.contribs.length} )
                    </h3>}
                    {this.state.hasContribs && this.state.showFeed && <div className="Contribs_Container">
                        {this.contribs.map((img, i) =>
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
                                        {/* <br></br>
                                            <p>
                                                {img.uploaded}
                                            </p> */}
                                    </div>
                                </div>
                            </LazyLoad>)}
                    </div>}
                    {!this.state.hasContribs && <div className="Welcome">
                        <h2>Welcome to LightMaps!!!</h2>
                        <br></br>
                        <h3>You can now upvote other peoples contributions</h3>
                        <br></br>
                        <p>LightMaps is free and always will be, this year I am raising money for suicide awareness.  You can donate following the link below if you would like to</p>
                        <br></br>
                        <p>You havent posted any photos yet, if you choose to post anything you will be able to manage your post here.</p>
                    </div>}

                    <Preview
                        togglePreview={this.togglePreview}
                        lightDex={this.state.lightDex}
                        contributions={true}
                        lights={this.contribs}
                    />
                </div>}
                {!this.state.register && !this.state.loggedIn && <form className="Login_Form" id="login-form" onSubmit={this.handleSubmit}>
                    <h1>
                        Log In
                    </h1>
                    <label>Email</label>
                    <br></br>
                    <input type="text" value={this.state.email} onChange={this.handleUserChange} />
                    <br></br>
                    <br></br>
                    <label>Password</label>
                    <br></br>
                    <input type="password" value={this.state.password} onChange={this.handlePassChange} />

                    <div id="login-btn" onClick={this.handleSubmit}>
                        <img id="logout-img" src="./res/login.png" alt="oops"></img>
                        <p>Login</p>
                    </div>
                    <div id="register-btn" onClick={this.register}>
                        <img id="register-img" src="./res/register.png" alt="oops"></img>
                        <p>Register</p>
                    </div>
                </form>}
                {this.state.register &&
                    <Register
                        register={this.register}
                    />}
                <br></br>
                {this.state.error &&
                    <h3 onClick={this.dismissError}>
                        <button id="error-btn" onClick={this.dismissError}>✖</button>
                        {this.state.error}
                    </h3>}
            </div>
        );
    }
}

export default Profile