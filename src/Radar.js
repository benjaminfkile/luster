import Lighstore from './LightStore'
import Location from './Location'
import GeoData from './GeoData'

let Radar = []
let locationHistory = []

let dbInterval = setInterval(listen4DB, 1000)

function listen4DB() {
    if (Lighstore.length > 0 && (GeoData.latitude || Location.lat)) {
        clearInterval(dbInterval)
        setInterval(updateCoords, 1000)
        polulateRadar()
    }
}

function updateCoords() {

    if (Location && Location.lat) {
        locationHistory.unshift([Location.lat, Location.lng])
    } else {
        if (!Location.lat && GeoData[0].latitude) {
            locationHistory.unshift([GeoData[0].latitude, GeoData[0].longitude])
        }
    }

    if (Location.lat || GeoData[0].latitude) {

        if (locationHistory.length > 1 && locationHistory[0][0] !== locationHistory[1][0] && locationHistory[0][1] !== locationHistory[1][1]) {
            polulateRadar()
        }
    }
}

function polulateRadar() {
    
    Radar.length = 0

    if (Location.lat) {
        for (let i = 0; i < Lighstore.length; i++) {
            if (Lighstore.length > 0) {
                Radar.push([distance(Location.lat, Location.lng, Lighstore[i].lat, Lighstore[i].lng, "N"), Lighstore[i]])
            }
        }
    } else {
        if (GeoData && GeoData[0].latitude) {
            for (let i = 0; i < Lighstore.length; i++) {
                if (Lighstore.length > 0) {
                    Radar.push([distance(GeoData[0].latitude, GeoData[0].longitude, Lighstore[i].lat, Lighstore[i].lng, "N"), Lighstore[i]])
                }
            }
        }
    }
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