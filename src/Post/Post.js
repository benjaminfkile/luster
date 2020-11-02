import React, { Component } from 'react';
import Location from '../Location'
import GeoData from '../GeoData'
import Geocode from "react-geocode";
import Upload from './Upload'
import './Post.css'
Geocode.setApiKey("AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM");
Geocode.setLanguage("en");


class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            input: '',
            placeholder: "Search address",
            results: [],
            typing: false,
            typingTimeout: 0,
            geoLat: 37.0902,
            geoLng: -95.7129,
            lat: null,
            lng: null,
            hasLocation: false,
            accurateLocation: false,
            locationAccuracy: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.clearPlaceholder = this.clearPlaceholder.bind(this);
    }

    componentDidMount() {
        this.geoInterval = setInterval(this.getGeo, 100)
        this.accuracyInterval = setInterval(this.checkLocationAccuracy, 100)
    }

    checkLocationAccuracy = () => {
        if (Location.lat) {
            if (Location.accuracy > 50) {
                this.setState({ accurateLocation: false, locationAccuracy: Location.accuracy })
            } else {
                this.setState({ accurateLocation: true, lat: Location.lat, lng: Location.lng, locationAccuracy: Location.accuracy })
            }
            clearInterval(this.accuracyInterval)
        }
    }

    getGeo = () => {

        if (GeoData.length > 0 && GeoData[0].latitude) {
            clearInterval(this.geoInterval)
            this.setState({ geoLat: GeoData[0].latitude, geoLng: GeoData[0].longitude, radius: 50 })
        }
    }

    handleChange = (event) => {
        const self = this;

        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            input: event.target.value,
            typing: false,
            typingTimeout: setTimeout(function () {
                self.searchAddress(self.state.input);
            }, 1000)
        });
    }

    clearPlaceholder = () => {
        this.setState({ placeholder: "" })
    }

    searchAddress = (input) => {
        console.log('no input')
        if(input !== ""){
            console.log("searching addresses")
            let temp = []
            this.setState({ results: null })
            let targetUrl = "https://maps.googleapis.com/maps/api/place/queryautocomplete/json?location=" + this.state.geoLat + "," + this.state.geoLng + "&radius=" + this.state.radius + "&key=AIzaSyAj6zqW55nq95JI6gGGj-BtkN_hfZhJScM&input=" + input.split(' ').join('+')
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            fetch(proxyurl + targetUrl)
                .then(res => res.json())
                .then(res => {
                    for (let i = 0; i < res.predictions.length; i++) {
                        temp.push(res.predictions[i].description)
                    }
                    this.setState({ results: temp, address: '', lat: null, lng: null })
                })
                .catch(() => console.log("Can’t access " + targetUrl + " response. Blocked by browser?"))
        }else{
            this.setState({ results: [], address: '', lat: null, lng: null })
        }
    }

    convertAddressToCoords = (address) => {
        Geocode.fromAddress(address).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                this.setState({ lat: lat, lng: lng, address: address, results: null })
            },
            error => {
                console.error(error);
            }
        );
    }

    toDegreesMinutesAndSeconds = (coordinate) => {
        let absolute = Math.abs(coordinate);
        let degrees = Math.floor(absolute);
        let minutesNotTruncated = (absolute - degrees) * 60;
        let minutes = Math.floor(minutesNotTruncated);
        let seconds = Math.floor((minutesNotTruncated - minutes) * 60);
        return degrees + '\u00BA ' + minutes + '\u0027 ' + seconds + '\u0022';
    }

    convertDMS = (lat, lng) => {
        let latitude = this.toDegreesMinutesAndSeconds(lat);
        let latitudeCardinal = lat >= 0 ? 'N' : 'S';
        let longitude = this.toDegreesMinutesAndSeconds(lng);
        let longitudeCardinal = lng >= 0 ? 'E' : 'W';
        return latitude + ' ' + latitudeCardinal + '\n' + longitude + ' ' + longitudeCardinal;
    }

    useAddress = () => {
        this.setState({ hasLocation: true })
    }

    discardAddress = () => {
        this.setState({ address: '', input: '', results: [], lat: null, lng: null })
    }

    render() {

        return (
            <div>
                {window.user && !this.state.hasLocation && <div className="Post">
                    <h1>Post</h1>
                    <input type="text" value={this.state.input} placeholder={this.state.placeholder} onClick={this.clearPlaceholder} onChange={this.handleChange} />
                    {this.state.results && <div className="Address_Container">
                        {this.state.results.map((result, i) =>
                            <p className="Address_Suggestion" key={i} onClick={() => this.convertAddressToCoords(result)}>{result}</p>
                        )}
                    </div>}
                    {this.state.lat && this.state.address !== '' && <div className="Selection">
                        <p id="address">Your Address:</p>
                        <p id="address1">{this.state.address}</p>
                        <p id="coords">Address Coordinates:</p>
                        <p id="coords1">{this.convertDMS(this.state.lat, this.state.lng)}</p>
                        <div className="Yes_Option" onClick={this.useAddress}>
                            <img id="use-img" src="./res/yes.png" alt="oops" />
                            <p>Use</p>
                        </div>
                        <div className="No_Option" onClick={this.discardAddress}>
                            <img id="use-img" src="./res/no.png" alt="oops" />
                            <p>Clear</p>
                        </div>
                    </div>}
                    {(this.state.accurateLocation && !this.state.results) || (this.state.accurateLocation && this.state.results.length === 0) && <div className="Selection">
                        <p id="coords">Your Coordinates:</p>
                        <p id="coords1">{this.convertDMS(Location.lat, Location.lng)}</p>
                        <p id="accuracy"> Coordinate Accuracy:</p>
                        <p id="accuracy1">{this.state.locationAccuracy} m</p>
                        <div className="Yes_Option" onClick={this.useAddress}>
                            <img id="use-img" src="./res/yes.png" alt="oops" />
                            <p>Use</p>
                        </div>
                    </div>}
                    {(!this.state.accurateLocation && !this.state.results) || (!this.state.accurateLocation && this.state.results.length === 0) && <div className="Location_Error">
                        <h3>I cant draw an accurate bead on your location.</h3>
                        <br></br>
                        <p>This could be caused by a weak signal from a satelite or you have denied LightMaps access to your location</p>
                        <br></br>
                        <p>You will have to manually enter your address instead</p>

                    </div>}
                </div>}
                {window.user && this.state.hasLocation && <div>
                    <Upload
                        lat={this.state.lat}
                        lng={this.state.lng}
                    />
                </div>}
                {!window.user && <div className="Unvalidated">
                    <h3>
                        Log in or Register to post photos!
                </h3>
                    <img src="./res/2.png" id="noImg" alt='A tree'></img>

                </div>}
            </div>


        )
    }
}
export default Post