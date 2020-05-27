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
        console.log(this.state.hamburger)
    }

    render() {
        return (
            <div className="Nav">

                <div className="Menu">
                    {!this.state.hamburger && <div className="MenuClosed">
                    <img src="./res/closeMenu.png" alt="*" onClick={this.toggleBurger}></img>
                    </div>}
                    {this.state.hamburger && <div className="MenuOpen">
                    <img src="./res/openMenu.png" alt="*"  onClick={this.toggleBurger}></img>
                    </div>}
                </div>


                {this.state.hamburger && <div className="Routes">
                    <div className="Map_Route" tabIndex="1">
                        <li>
                            <Link to='/'>
                                Map
                            </Link>
                        </li>

                    </div>
                    <div className="Browse_Route" tabIndex="2">
                        <li>
                            <Link to='/browse'>
                                Browse
                            </Link>
                        </li>
                    </div>
                    <div className="About_Route" tabIndex="3">
                        <li>
                            <Link to='/about'>
                                About
                            </Link>
                        </li>
                    </div>
                    <div className="Contribute_Route" tabIndex="4">
                        <li>

                            <Link to='/contribute'>
                                Contribute
                            </Link>
                        </li>
                    </div>
                    <div className="Help_Route" tabIndex="5">
                        <li>
                            <Link to='/help'>
                                Help
                            </Link>
                        </li>
                    </div>
                </div>}


            </div>
        )
    }
}

export default Nav