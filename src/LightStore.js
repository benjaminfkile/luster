//  let LightStore = []

// function getLights() {
//     let targetUrl = 'https://agile-wildwood-40014.herokuapp.com/api/lights/';
//     fetch(targetUrl)
//       .then(response => response.json())
//       .then(data => {
//         // this.setState({ lights: data })
//         //for(let i = 0; i < data.length; i++){
//             console.log(data)
//         //}
//         LightStore.push(data)

//       })
//       .catch(error => alert('Sorry the service is down \n:(\nPlease try again later'));
//   }

//  getLights()

let LightStore =
    [
        { "lat": "46.790", "lng": "-114.040", "url": "https://i.ibb.co/51VZM6F/46-790-114-040.jpg", "rating": "3" },
        { "lat": "46.821", "lng": "-114.042", "url": "https://i.ibb.co/djH6jY6/46-821-114-042.jpg", "rating": "3" },
        { "lat": "46.805", "lng": "-114.050", "url": "https://i.ibb.co/g3p3hPJ/46-805-114-050.jpg", "rating": "3" },
        { "lat": "46.805", "lng": "-114.054", "url": "https://i.ibb.co/G01mdNx/46-805-114-054.jpg", "rating": "4" },
        { "lat": "46.804", "lng": "-114.060", "url": "https://i.ibb.co/Ky9v25Z/46-804-114-060.jpg", "rating": "2" },
        { "lat": "46.818", "lng": "-114.034", "url": "https://i.ibb.co/rM9jwgD/46-818-114-034.jpg", "rating": "2" },
        { "lat": "46.825", "lng": "-114.042", "url": "https://i.ibb.co/CWKS0ZB/46-825-114-042.jpg", "rating": "3" },
        { "lat": "46.840", "lng": "-114.028", "url": "https://i.ibb.co/DfJdgmj/46-840-114-028.jpg", "rating": "3" },
        { "lat": "46.802", "lng": "-114.057", "url": "https://i.ibb.co/2WDqrnq/46-802-114-057.jpg", "rating": "3" },
        { "lat": "46.826", "lng": "-114.037", "url": "https://i.ibb.co/zSyB88K/46-826-114-037.jpg", "rating": "3" },
        { "lat": "46.927", "lng": "-114.032", "url": "https://i.ibb.co/TRzfhn3/46-927-114-032.jpg", "rating": "4" },
        { "lat": "46.825", "lng": "-113.999", "url": "https://i.ibb.co/7JRWmqs/46-825-113-999.jpg", "rating": "5" },
        { "lat": "46.833", "lng": "-114.030", "url": "https://i.ibb.co/tHvfBMG/46-833-114-030.jpg", "rating": "4" },
        { "lat": "46.841", "lng": "-114.027", "url": "https://i.ibb.co/XjpGrY1/46-841-114-027.jpg", "rating": "5" },
        { "lat": "46.821", "lng": "-114.027", "url": "https://i.ibb.co/x6CFwmy/46-821-114-003.jpg", "rating": "4" },
        { "lat": "46.825", "lng": "-113.997", "url": "https://i.ibb.co/rktKy5n/46-825-113-997.jpg", "rating": "4" },
        { "lat": "46.851", "lng": "-114.035", "url": "https://i.ibb.co/qkKX0bb/46-851-114-035.jpg", "rating": "3" },
        { "lat": "40.758", "lng": "-73.9855", "url": "https://i.ibb.co/yNQYfzh/40-7580-73-9855.jpg", "rating": "5" }
    ]


export default LightStore