import LightStore from './LightStore'
import Location from './Location'
// import GeoData from './GeoData'

let Radar = {
    targets: [],
    locationHistory: []
}

let dbInterval = setInterval(listen4DB, 1000)

function listen4DB() {
    if (LightStore.lights.length > 0 && Location.coords.lat) {
        clearInterval(dbInterval)
        setInterval(updateCoords, 1000)
        polulateRadar()
    }
}

function updateCoords() {

    if (/*Location &&*/ Location.coords.lat) {
        Radar.locationHistory.unshift([Location.coords.lat, Location.coords.lng])
    } 
    // else {
    //     if (!Location.coords.lat && GeoData[0].latitude) {
    //         Radar.locationHistory.unshift([GeoData[0].latitude, GeoData[0].longitude])
    //     }
    // }

    if (Location.coords.lat /*|| GeoData[0].latitude*/) {
        if (Radar.locationHistory.length > 1 && Radar.locationHistory[0][0] !== Radar.locationHistory[1][0] && Radar.locationHistory[0][1] !== Radar.locationHistory[1][1]) {
            polulateRadar()
        }
    }
}

function polulateRadar() {
    //why doesnt Radar.targets = [] work?
    Radar.targets.length = 0

    if (Location.coords.lat) {
        for (let i = 0; i < LightStore.lights.length; i++) {
            if (LightStore.lights.length > 0) {
                Radar.targets.push([distance(Location.coords.lat, Location.coords.lng, LightStore.lights[i].lat, LightStore.lights[i].lng, "N"), LightStore.lights[i]])
            }
        }
    } 
    // else {
    //     if (GeoData && GeoData[0].latitude) {
    //         for (let i = 0; i < Lighstore.length; i++) {
    //             if (Lighstore.length > 0) {
    //                 Radar.targets.push([distance(GeoData[0].latitude, GeoData[0].longitude, Lighstore[i].lat, Lighstore[i].lng, "N"), Lighstore[i]])
    //             }
    //         }
    //     }
    // }
    Radar.targets = Radar.targets.sort((a, b) => a[0] - b[0])
}

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