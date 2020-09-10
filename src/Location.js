let Location = []
let wait
let wv = true

function isWebview() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if (!(ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1)){
        getLocation()
        wait = setInterval(awaitUserAllow, 1000)
    }
}

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation)
    }
}

function setLocation(position) {
    Location.lat = position.coords.latitude
    Location.lng = position.coords.longitude
}

function awaitUserAllow() {
    if (Location.lat) {
        clearInterval(wait)
        setInterval(function () {
            getLocation()
        }, 1000);
    }
}
isWebview()
export default Location