let LightStore = []

function getLights() {
    let targetUrl = 'https://agile-wildwood-40014.herokuapp.com/api/lights';
    // let targetUrl = 'http://localhost:8000/api/lights'

    fetch(targetUrl)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].on === 't') {
                    LightStore.push(data[i])
                }
                // console.log(data[i])
            }
        })
        .catch(error => alert('Sorry the service is down \n:(\nPlease try again later'));
}

getLights()

export default LightStore