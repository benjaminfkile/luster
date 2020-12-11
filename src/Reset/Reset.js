import React, { Component } from 'react'
import Spinner from '../Spinner/Spinner'
import ApiStore from '../ApiStore'
import './Reset.css'

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass1: '',
            pass2: '',
            code: '',
            error: '',
            codeSent: false,
            invalidCode: false,
            reset: false,
            loading: false
        };

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

        if (!this.state.email) {
            return this.setState({ error: 'Email is required', loading: false });
        }

        if (this.state.email) {
            fetch(ApiStore + '/api/users/resetPass', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                })
            }).then(res => {
                this.setState({ loading: false })
                if (res.status === 200) {
                    this.setState({ codeSent: true })
                }
                if (res.status === 404) {
                    this.setState({ error: 'not registered' })
                }
            })
        }
        return this.setState({ error: '' });
    }

    checkCode = (evt) => {

        evt.preventDefault();
        this.setState({ loading: true })

        if (!this.state.pass1 && !this.state.pass2) {
            return this.setState({ error: 'Password is required', loading: false });
        }

        if (this.state.pass1 !== this.state.pass2) {
            return this.setState({ error: 'Passwords dont match', loading: false });
        }

        if (this.state.codeSent && !this.state.code) {
            return this.setState({ error: '5 digit code required', loading: false });
        }

        fetch(ApiStore + '/api/users/resetPass/update', {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                code: this.state.code,
                pass: this.state.pass2
            })
        }).then(res => {
            this.setState({ loading: false })
            if (res.status === 200) {
                this.setState({ reset: true })
                this.props.reset(1)
            }
            if (res.status === 403) {
                return this.setState({ error: 'Invalid code', loading: false, invalidCode: true });
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

    render() {

        return (
            <div className="Reset">
                <div className="Loading">
                    {this.state.loading && <Spinner />}
                </div>
                {!this.state.loading && <form className="Reset_Form" id="reset-from" onSubmit={this.handleSubmit}>
                    <h1>
                        Reset Password
                    </h1>
                    <label>Email</label>
                    <br></br>
                    <input type="text" value={this.state.email} onChange={this.handleUserChange} />
                    <br></br>
                    {this.state.codeSent && <div className="Reset_Code_Sent">
                        <label>Password</label>
                        <br></br>
                        <input type="password" value={this.state.pass1} onChange={this.handlePass1Change} />
                        <br></br>
                        <label>Re Enter Password</label>
                        <br></br>
                        <input type="password" value={this.state.pass2} onChange={this.handlePass2Change} />
                        <br></br>
                        <label>Code</label>
                        <br></br>
                        <input type="text" value={this.state.code} onChange={this.handleCodeChange} />
                        <br></br>
                    </div>}
                    {!this.state.codeSent && <div id="reset-btn" onClick={this.handleSubmit}>
                        <img id="next-img" src="./res/next.png" alt="oops"></img>
                        <p>Submit</p>
                    </div>}
                    {this.state.codeSent && <div id="verify-btn" onClick={this.checkCode}>
                        <img id="verify-img" src="./res/verify.png" alt="oops"></img>
                        <p>Verify Code</p>
                    </div>}
                    {this.state.codeSent && !this.state.invalidCode && <p>I sent you an email with a reset code, please choose a new password and enter the code into the field to reset your password.</p>}
                </form>}
                <br></br>
                <div id="back-btn" onClick={() => this.props.reset(1)}>
                    <img id="back-img" src="./res/back.png" alt="oops"></img>
                    <p>Back</p>
                </div>
                {this.state.error &&
                    <h3 id="reset" onClick={this.dismissError}>
                        <br></br>
                        <button onClick={this.dismissError}>x</button>
                        {this.state.error}
                    </h3>}
            </div>
        );
    }
}

export default Reset