import React, { Component } from 'react'
import Register from '../Register/Register'
import '../Login/Login.css'


class Login extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            error: '',
            register: false,
            loggedIn: false
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
    }

    componentDidMount() {
        if(window.user){
            this.setState({loggedIn: true , email: window.user})
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
            console.log(res)
            if (res.status === 200) {
                this.setState({ loggedIn: true })
                window.user = this.state.email
            }
        })
        return this.setState({ error: '' });
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

    render() {

        console.log(window.user)
        
        return (
            <div className="Login">
                {this.state.loggedIn && <div className="Logout">
                    <h2>
                        Signed in as 
                    </h2>
                    <br></br>
                    <h3>
                        {this.state.email}
                    </h3>
                    <br></br>
                    <button onClick={this.logOut}>Log Out</button>
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