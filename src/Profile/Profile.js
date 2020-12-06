import React, { Component } from 'react'
import ApiStore from '../ApiStore'
import Preview from "../Preview/Preview"
import LazyLoad from 'react-lazyload';
import Register from '../Register/Register'
import Reset from '../Reset/Reset'
import Spinner from '../Spinner/Spinner'
import './Profile.css'

class Profile extends Component {

    contribs = []
    currUser = ''

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: '',
            register: false,
            reset: '',
            loading: false,
            loggedIn: false,
            hasContribs: false,
            showFeed: true,
            lightDex: -1,
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
        this.userInterval = setInterval(this.listen4User, 1000)
    }

    componentWillUnmount() {
        this.contribs = []
    }

    listen4User = () => {
        if (window.user) {
            this.getContributions()
            clearInterval(this.userInterval)
        }
    }

    dismissError() {
        this.setState({ error: '' });
    }

    getContributions = () => {
        this.setState({ loading: true })
        this.contribs.length = 0
        let targetUrl = ApiStore + '/api/lights/contributor/' + window.user
        fetch(targetUrl)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    this.contribs.push(data[i])
                    let date = new Date(parseInt(data[0].uploaded)).toLocaleDateString("en-US")
                    let timestamp = date 
                    this.contribs[i].uploaded = timestamp
                }
                if (data.length > 0) {
                    this.setState({ hasContribs: true })
                }
            }).then(() =>
                this.setState({ loading: false })
            )
            .catch(error => alert('Sorry the service is down \n:(\nPlease try asadfsdfsdafsadfsadfasdfgain later'));
    }

    handleSubmit(evt) {

        evt.preventDefault();
        this.setState({ loading: true })
        window.pass = this.state.password

        if (!this.state.email) {
            this.errorInterval = setInterval(this.listen4Error, 3000)
            return this.setState({ error: ' Email is required', loading: false });
        }

        if (!this.state.password) {
            this.errorInterval = setInterval(this.listen4Error, 3000)
            return this.setState({ error: ' Password is required', loading: false });
        }
        fetch(ApiStore + '/api/users/validate', {

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
            this.setState({ loading: false })
            if (res.status === 200) {
                this.setState({ loggedIn: true })
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
        let targetUrl = ApiStore + '/api/users/' + this.state.email;
        fetch(targetUrl)
            .then(response => response.json())
            .then(data => {
                window.user = data.id
                window.name = data.name
            })

            console.log(window.name)
    }

    logOut = () => {
        window.location.reload()
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

    resetPass = (args) => {
        if (args === 1) {
            this.setState({ reset: false })
        } else {
            this.setState({ reset: true })
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
                <div className="Loading">
                    {this.state.loading && <Spinner />}
                </div>
                {this.state.loggedIn && !this.state.loading && <div className="Profile">
                    <h1>Hi {window.name.charAt(0).toUpperCase() + window.name.slice(1)}</h1>
                    {this.state.showFeed && <div id="logout-btn" onClick={this.logOut}>
                        <img id="logout-img" src="./res/logout.png" alt="oops"></img>
                        <p>Logout</p>
                    </div>}
                    {this.state.hasContribs && !this.state.loading && this.state.showFeed && <h3>
                        Your Contributions ( {this.contribs.length} )
                    </h3>}
                    {this.state.hasContribs && this.state.showFeed && !this.state.loading && <div className="Contribs_Container">
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
                                        <div className="Upload_Date">
                                            <br></br>
                                            <p>
                                                {/* {img.uploaded} */}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </LazyLoad>)}
                    </div>}
                    {!this.state.hasContribs && <div className="No_Contribs">
                        <h3>
                            Welcome to 406Lights
                            </h3>
                        <br></br>
                        <p>
                            You will see your contributions in place of this message if you decide to post any christmas displays.
                            </p>
                        <br></br>
                        <p>
                            You can upvote other displays now as well
                            </p>
                    </div>}
                    <Preview
                        togglePreview={this.togglePreview}
                        lightDex={this.state.lightDex}
                        contributions={true}
                        lights={this.contribs}
                    />
                </div>}
                {!this.state.register && !this.state.reset && !this.state.loggedIn && !this.state.loading && !this.state.loading && <form className="Login_Form" id="login-form" onSubmit={this.handleSubmit}>
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
                    <div id="forgot-btn" onClick={this.resetPass}>
                        <p>Forgot Password?</p>
                    </div>
                </form>}
                {this.state.register &&
                    <Register
                        register={this.register}
                    />}
                {this.state.reset &&
                    <Reset
                        reset={this.resetPass}
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

/*
fix name not changing when differrent user logs in during same session
*/