//handles the updating of the user location
let Location = {
    coords: {
        lat: null,
        lng: null
    },
    bounds: 'in',
    allowed: false,
}

const latLngBounds = {
    north: 49.00139,
    south: 44.358221,
    east: -104.039138,
    west: -116.050003,
}

let app = true
//check if Facebook or Instagram
function inApp() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if ((ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)) {
        app = true
    } else {
        app = false
    }
}

function getLocation() {

    if (Location.coords.lat &&
        (Location.coords.lat <= latLngBounds.north
            && Location.coords.lat >= latLngBounds.south
            && Location.coords.lng <= latLngBounds.east
            && Location.coords.lng >= latLngBounds.west)) {
        Location.bounds = 'in'
    } else {
        Location.bounds = 'out'
    }
    if (!app && !window.haltLocation && navigator.geolocation) {//dont set location if window.HaltLocation
        navigator.geolocation.getCurrentPosition(setLocation)
    }
}

function setLocation(position) {
    if (!window.haltLocation) {
        Location.coords.lat = position.coords.latitude
        Location.coords.lng = position.coords.longitude
        Location.accuracy = position.coords.accuracy
    } 
}

navigator.geolocation.getCurrentPosition(setLocation)
inApp()
setInterval(function () {
    getLocation()
}, 1000);

export default Location