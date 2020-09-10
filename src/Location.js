let Location = []
let wait = setInterval(awaitUserAllow, 1000)

function isWebview(){
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1) || (ua.indexOf('Instagram') > -1);
}

function getLocation() {
    if (!isWebview() && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation)
    } else {
        alert("Geolocation is not supported by this browser.")
    }
}

function setLocation(position) {
    Location.lat = position.coords.latitude
    Location.lng = position.coords.longitude
}

function awaitUserAllow() {
    // console.log("Waiting for user to allow location")
    if (!isWebview() && Location.lat) {
        clearInterval(wait)
        setInterval(function () {
            getLocation()
        }, 1000);
    }
}

getLocation()

export default Location