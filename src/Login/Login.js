import React, { Component } from 'react'
import Preview from "../Preview/Preview"
// import Snow from '../Snow/Snow'
import LazyLoad from 'react-lazyload';
import Register from '../Register/Register'
import '../Login/Login.css'

let contribs = []

class Login extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
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
        contribs = []
        if (window.user) {
            this.setState({ loggedIn: true, name: window.name })
            this.getContributions()
        }
    }

    getContributions = () => {
        // let targetUrl = 'http://localhost:8000/api/lights/contributor/' + window.user
        let targetUrl = 'https://agile-wildwood-40014.herokuapp.com/api/lights/contributor/' + window.user
        fetch(targetUrl)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    //console.log(data[i])
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
            //console.log(contribs)
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

        // fetch('http://localhost:8000/api/users/validate', {
            fetch('https://agile-wildwood-40014.herokuapp.com/api/users/validate', {

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
        let targetUrl = 'https://agile-wildwood-40014.herokuapp.com/api/users/' + this.state.email;
        // let targetUrl = 'http://localhost:8000/api/users/' + this.state.email

        fetch(targetUrl)
            .then(response => response.json())
            .then(data => {
                window.user = data.id
                window.name = data.name
                this.setState({ name: data.name })
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
                {this.state.loggedIn && <div className="Logout">
                    <h1>Hi {this.state.name}</h1>
                    <br></br>
                    <button onClick={this.logOut}>Log Out</button>
                    {this.state.hasContribs && <div className={this.state.showFeed ? 'Fade_In' : 'Fade_Out'} >
                        <div className="Contribs_Container">
                            <h1>
                                Your Contributions
                            </h1>
                            <br></br>
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
                        </div>
                    </div>}
                    <Preview
                        togglePreview={this.togglePreview}
                        lightDex={this.state.lightDex}
                        contributions={true}
                        LightStore={contribs}
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

export default Login