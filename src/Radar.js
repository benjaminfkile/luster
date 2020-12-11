import LightStore from './LightStore'
import Location from './Location'

let Radar = {
    targets: [],
    locationHistory: []
}

let dbInterval = setInterval(listen4DB, 500)

//wait for light data
function listen4DB() {
    if (LightStore.lights.length > 0 && Location.coords.lat) {
        clearInterval(dbInterval)
        setInterval(updateCoords, 1000)
        polulateRadar()
    }
}
//add the new coordinates
function updateCoords() {
    if (Location.coords.lat) {
        Radar.locationHistory.unshift([Location.coords.lat, Location.coords.lng])
    } 

    if (Location.coords.lat) {
        if (Radar.locationHistory.length > 1 && Radar.locationHistory[0][0] !== Radar.locationHistory[1][0] && Radar.locationHistory[0][1] !== Radar.locationHistory[1][1]) {
            polulateRadar()
        }
    }
}
//push the data to the targets array with the updated distances
function polulateRadar() {
    Radar.targets.length = 0

    if (Location.coords.lat) {
        for (let i = 0; i < LightStore.lights.length; i++) {
            if (LightStore.lights.length > 0) {
                Radar.targets.push([distance(Location.coords.lat, Location.coords.lng, LightStore.lights[i].lat, LightStore.lights[i].lng, "N"), LightStore.lights[i]])
            }
        }
    } 
    Radar.targets = Radar.targets.sort((a, b) => a[0] - b[0])
}
//calculate the nautical mile distances
function distance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1 / 180
    let radlat2 = Math.PI * lat2 / 180
    let theta = lon1 - lon2
    let radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === "K") { dist = dist * 1.609344 }
    if (unit === "N") { dist = dist * 0.8684 }
    return dist
}

export default Radar