import api from './api'

let LightStore = []

function getLights() {
    let targetUrl = api + '/api/lights';

    fetch(targetUrl)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].on === 't') {
                    LightStore.push(data[i])
                }
            }
        })
        .catch(error => alert('Sorry the service is down \n:(\nPlease try again later'));
}

getLights()

export default LightStore