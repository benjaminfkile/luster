let Location = []
let wait = setInterval(awaitUserAllow, 1000)
let wv = true

function isWebview() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if (!(ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1));
    wv = false
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

function awaitUserAllow() {
    // console.log("Waiting for user to allow location")
    if (!wv && Location.lat) {
        clearInterval(wait)
        setInterval(function () {
            getLocation()
        }, 1000);
    }
}
isWebview()
getLocation()
export default Location