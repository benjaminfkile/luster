let Location = []

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

setInterval(function () {
    getLocation()
}, 3000);

getLocation()

export default Location