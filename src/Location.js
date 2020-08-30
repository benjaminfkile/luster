let Location = []
let wait = setInterval(awaitUserAllow, 1000)

function getLocation() {
    if (navigator.geolocation) {
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
    console.log("Waiting for user to allow location")
    if (Location.lat) {
        clearInterval(wait)
        setInterval(function () {
            getLocation()
        }, 10000);
    }
    console.log(Location)
}

getLocation()

export default Location