let GeoData = []

function fetchGeo() {
    fetch("https://geolocation-db.com/json/7733a990-ebd4-11ea-b9a6-2955706ddbf3/ipv4")
        .then(res => res.json())
        .then(data => GeoData.push(data))}
fetchGeo()

export default GeoData