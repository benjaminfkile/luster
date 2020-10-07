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
    }
}

function setLocation(position) {
    Location.lat = position.coords.latitude
    Location.lng = position.coords.longitude
}

navigator.geolocation.getCurrentPosition(setLocation)
inApp()
setInterval(function () {
    getLocation()
}, 1000);

export default Location