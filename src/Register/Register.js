import React, { Component } from 'react'
import Spinner from '../Spinner/Spinner'
import ApiStore from '../ApiStore'
import '../Register/Register.css'

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            pass1: '',
            pass2: '',
            code: '',
            error: '',
            codeSent: false,
            invalidCode: false,
            registered: false,
            emailTaken: false,
            loading: false
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handlePass1Change = this.handlePass1Change.bind(this);
        this.handlePass2Change = this.handlePass2Change.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.dismissError = this.dismissError.bind(this);
    }

    dismissError() {
        this.setState({ error: '' });
    }

    handleSubmit(evt) {

        evt.preventDefault();
        this.setState({ loading: true })

        if (!this.state.name) {
            return this.setState({ error: 'Name is required', loading: false });
        }

        if (!this.state.email) {
            return this.setState({ error: 'Email is required', loading: false });
        }

        if (!this.state.pass1 && !this.state.pass2) {
            return this.setState({ error: 'Password is required', loading: false });
        }

        if (this.state.pass1 !== this.state.pass2) {
            return this.setState({ error: 'Passwords dont match', loading: false });
        }

        if (this.state.codeSent && !this.state.code) {
            return this.setState({ error: '5 digit code required', loading: false });
        }



        if (this.state.name && this.state.email && this.state.pass1 && !this.state.codeSent) {
            fetch(ApiStore + '/api/users/new', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    pass: this.state.pass1
                })
            }).then(res => {
                this.setState({ loading: false })
                if (res.status === 200) {
                    this.setState({ emailTaken: false, codeSent: true })
                    // console.log("code sent")
                }
                if (res.status === 202) {
                    this.setState({ emailTaken: true, codeSent: false, error: 'Email already registered' })

                }
                if (res.status === 403) {
                    this.setState({ error: 'go away!!!' })
                }
            })
        }
        return this.setState({ error: '' });
    }

    checkCode = (evt) => {

        evt.preventDefault();
        this.setState({ loading: true })

        fetch(ApiStore + '/api/users/valCode', {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                code: this.state.code
            })
        }).then(res => {
            this.setState({ loading: false })
            if (res.status === 200) {
                this.setState({ registered: true })
                this.props.register(1)
            }
            if (res.status === 403) {
                return this.setState({ error: 'Invalid code', loading: false, invalidCode: true });
            }
            if (res.status === 400) {
                return this.setState({ error: 'Registratoin Error, please check your credentials and try again', loading: false });
            }
        })
    }

    handleUserChange(evt) {
        this.setState({
            email: evt.target.value,
        });
    };

    handlePass1Change(evt) {
        this.setState({
            pass1: evt.target.value,
        });
    }

    handlePass2Change(evt) {
        this.setState({
            pass2: evt.target.value,
        });
    }

    handleCodeChange(evt) {
        this.setState({
            code: evt.target.value, invalidCode: false
        });
    }

    handleNameChange(evt) {
        this.setState({
            name: evt.target.value,
        });
    }

    render() {

        return (
            <div className="Register">
                <div className="Loading">
                    {this.state.loading && <Spinner />}
                </div>
                {!this.state.loading && <form className="RegisterForm" onSubmit={this.handleSubmit}>
                    <h1>
                        Register
                    </h1>
                    <br></br>
                    <label>First Name</label>
                    <br></br>
                    <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                    <br></br>
                    <label>Email</label>
                    <br></br>
                    <input type="text" value={this.state.email} onChange={this.handleUserChange} />
                    <br></br>
                    <label>Password</label>
                    <br></br>
                    <input type="password" value={this.state.pass1} onChange={this.handlePass1Change} />
                    <br></br>
                    <label>Re Enter Password</label>
                    <br></br>
                    <input type="password" value={this.state.pass2} onChange={this.handlePass2Change} />
                    <br></br>
                    {this.state.codeSent && <div className="CodeSent">
                        <label>Code</label>
                        <br></br>
                        <input type="text" value={this.state.code} onChange={this.handleCodeChange} />
                        <br></br>
                    </div>}
                    {!this.state.codeSent && <div id="register-btn" onClick={this.handleSubmit}>
                        <img id="next-img" src="./res/next.png" alt="oops"></img>
                        <p>Submit</p>
                    </div>}
                    {this.state.codeSent && <div id="verify-btn" onClick={this.checkCode}>
                        <img id="verify-img" src="./res/verify.png" alt="oops"></img>
                        <p>Verify Code</p>
                    </div>}
                    {this.state.codeSent && !this.state.invalidCode && <p>I sent you an email with a verification code, please enter the code to finish registering.</p>}
                </form>}
                <br></br>
                <div id="back-btn" onClick={() => this.props.register(1)}>
                    <img id="back-img" src="./res/back.png" alt="oops"></img>
                    <p>Back</p>
                </div>
                {this.state.error &&
                    <h3 id="registration" onClick={this.dismissError}>
                        <br></br>
                        <button onClick={this.dismissError}>x</button>
                        {this.state.error}
                    </h3>}
            </div>
        );
    }

}

export default Register