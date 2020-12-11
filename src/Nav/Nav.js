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
    //toggle the menu
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
                        <img src="./res/open-menu.png" alt="*" onClick={this.toggleBurger}></img>
                    </div>}
                    {this.state.hamburger && <div className="MenuOpen">
                        <img src="./res/close-menu.png" alt="*" onClick={this.toggleBurger}></img>
                    </div>}
                </div>
                {/*Set up links for react-router*/}
                {this.state.hamburger && <div className="Routes">
                    <div className="Map_Route" tabIndex="1">
                        <Link to='/'>
                            <img id="nav-img" src="./res/nav-map-icon.png" alt="oops" onClick={this.toggleBurger}></img>
                        </Link>

                    </div>
                    <div className="Browse_Route" tabIndex="2">
                        <Link to='/browse'>
                            <img id="nav-img" src="./res/nav-browse-icon.png" alt="oops" onClick={this.toggleBurger}></img>
                        </Link>
                    </div>
                    <div className="Post_Route" tabIndex="3">
                        <Link to='/post'>
                            <img id="nav-img" src="./res/nav-post-icon.png" alt="oops" onClick={this.toggleBurger}></img>
                        </Link>
                    </div>
                    {!window.user && <div className="Profile_Route" tabIndex="4">
                        <Link to='/profile'>
                            <img id="nav-img" src="./res/logout.png" alt="oops" onClick={this.toggleBurger}></img>
                        </Link>
                    </div>}
                    {window.user && <div className="Profile_Route" tabIndex="4">
                        <Link to='/profile'>
                            <img id="nav-img" src="./res/nav-profile-icon.png" alt="oops" onClick={this.toggleBurger}></img>
                        </Link>
                    </div>}
                </div>}
            </div>
        )
    }
}

export default Nav