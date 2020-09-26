import React, { Component } from 'react'
import '../Login/Login.css'

class Register extends Component {

    constructor() {
        super();
        this.state = {
            uName: ' ',
            email: '',
            password: '',
            code: '',
            error: '',
            codeSent: false,
            registered: false,
            emailTaken: false
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
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

        fetch('http://localhost:8000/api/users/new', {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Ben',
                email: this.state.email,
                pass: this.state.password
            })
        }).then(res => {
            console.log(res)
            if (res.status === 200) {
                this.setState({ registered: true, emailTaken: false, codeSent: true})
                console.log("Registered?: " + this.state.registered)
            }
            if(res.status === 403){
                console.log(res.body)
                this.setState({ registered: false, emailTaken: true })
                console.log("Registered?: " + this.state.registered)
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

    handleCodeChange(evt) {
        this.setState({
            code: evt.target.code,
        });
    }

    handleNameChange(evt) {
        this.setState({
            uName: evt.target.uName,
        });
    }

    render() {
        // NOTE: I use data-attributes for easier E2E testing
        // but you don't need to target those (any css-selector will work)

        console.log("Registered?: " + this.state.loggedIn)

        return (
            <div className="Register">
                <form className="RegisterForm" onSubmit={this.handleSubmit}>
                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.dismissError}>
                            <button onClick={this.dismissError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                    <h1>
                        Register
                    </h1>
                    <label>Name</label>
                    <br></br>
                    <input type="text" value={this.state.uName} onChange={this.handleNameChange} />
                    <br></br>
                    <label>Email</label>
                    <br></br>
                    <input type="text" value={this.state.email} onChange={this.handleUserChange} />
                    <br></br>
                    <label>Password</label>
                    <br></br>
                    <input type="password" value={this.state.password} onChange={this.handlePassChange} />
                    <br></br>
                    {this.state.codeSent && <div className="CodeSent">
                    <label>Code</label>
                    <br></br>
                    <input type="text" value={this.state.code} onChange={this.handleCodeChange} />
                    <br></br>
                    </div>}
                    <input type="submit" value="Register" />

                </form>
            </div>
        );
    }

}

export default Register