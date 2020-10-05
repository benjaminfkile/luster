import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../Nav/Nav.css'

class Nav extends Component {
    constructor() {
        super();
        this.state = {
            hamburger: false
        }
    }

    toggleBurger = () => {
        if (this.state.hamburger === false) {
            this.setState({ hamburger: true })
        } else {
            this.setState({ hamburger: false })
        }
    }

    render() {
        return (
            <div className="Nav">

                <div className="Menu">
                    {!this.state.hamburger && <div className="MenuClosed">
                        <img src="./res/openMenu.png" alt="*" onClick={this.toggleBurger}></img>
                    </div>}
                    {this.state.hamburger && <div className="MenuOpen">
                        <img src="./res/closeMenu.png" alt="*" onClick={this.toggleBurger}></img>
                    </div>}
                </div>


                {this.state.hamburger && <div className="Routes">
                    <div className="Map_Route" tabIndex="1">
                        <li onClick={this.toggleBurger}>
                            <Link to='/'>
                                Map |
                            </Link>
                        </li>

                    </div>
                    <div className="Browse_Route" tabIndex="2">
                        <li onClick={this.toggleBurger}>
                            <Link to='/browse'>
                                Browse |
                            </Link>
                        </li>
                    </div>
                    <div className="Post_Route" tabIndex="3">
                        <li onClick={this.toggleBurger}>
                            <Link to='/post'>
                                Post |
                            </Link>
                        </li>
                    </div>
                    {!window.user && <div className="Login_Route" tabIndex="4">
                        <li onClick={this.toggleBurger}>

                            <Link to='/login'>
                                Login
                            </Link>
                        </li>
                    </div>}
                    {window.user && <div className="Login_Route" tabIndex="4">
                        <li onClick={this.toggleBurger}>

                            <Link to='/login'>
                                Logout
                            </Link>
                        </li>
                    </div>}
                </div>}
            </div>
        )
    }
}

export default Nav