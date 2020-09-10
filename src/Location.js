let Location = []
let wv = true

function isWebview() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if ((ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)) {
        wv = true
    } else {
        wv = false
    }
}

function getLocation() {
    if (!wv && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation)
    }
}

function setLocation(position) {
    Location.lat = position.coords.latitude
    Location.lng = position.coords.longitude
}

isWebview()
setInterval(getLocation, 1000)

export default Location