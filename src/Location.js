let Location = []
let app = true

function inApp() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if ((ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)) {
        app = true
    } else {
        app = false
    }
}

function getLocation() {
    if (!app && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation)
        // console.log("Web")
    }
}

function setLocation(position) {
    Location.lat = position.coords.latitude
    Location.lng = position.coords.longitude
}

navigator.geolocation.getCurrentPosition(setLocation)
inApp()
const interval = setInterval(function () {
    getLocation()
}, 100);

export default Location