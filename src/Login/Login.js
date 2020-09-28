import React, { Component } from 'react'
import Register from '../Register/Register'
import '../Login/Login.css'

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: '',
            loggedIn: false,
            register: false
        };

        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
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
                console.log("Logged in?: " + this.state.loggedIn)
            }
        })

        return this.setState({ error: '' });

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
        // NOTE: I use data-attributes for easier E2E testing
        // but you don't need to target those (any css-selector will work)

        console.log("Logged in?: " + this.state.loggedIn)

        return (
            <div className="Login">
                {!this.state.register && <form className="LoginForm" onSubmit={this.handleSubmit}>
                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.dismissError}>
                            <button onClick={this.dismissError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                    <h1>
                        Log In
                    </h1>
                    <label>Email</label>
                    <br></br>
                    <input type="text" data-test="email" value={this.state.email} onChange={this.handleUserChange} />
                    <br></br>
                    <label>Password</label>
                    <br></br>
                    <input type="password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
                    <br></br>
                    <br></br>
                    <input type="submit" value="Log In" data-test="submit" />
                    <br></br>
                    <br></br>
                    <button id="register-btn" onClick={this.register}>Register</button>
                </form>}
                {this.state.register &&
                    <Register
                        register={this.register}
                    />}
            </div>
        );
    }

}

export default Login