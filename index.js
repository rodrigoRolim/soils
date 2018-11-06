var express = require('express')
var app = express()
var axios = require('axios')
var inside = require('point-in-polygon')
var polygon = [ [ -1, -1 ], [ 1, -1 ], [ 1, 1 ], [ -1, 1 ] ];

app.set('view engine', 'ejs')
app.set('views', './views')

console.dir([
    inside([ -0.599999, 0.599999 ], polygon),
    inside([ 0.7, 0.2 ], polygon),
    inside([ 1.8, 1.1 ], polygon)
]);
app.listen(3000, () => {
    console.log("connected server")
})

app.get('/', function(req, res) {
    axios.get(`http://www.geoservicos.ibge.gov.br/geoserver/wms?service=WFS&version=1.0.0&request=GetFeature&typeName=CREN:solos_5000&outputFormat=JSON`)
      .then(response => {
        for (var i = 0; i < response.data.features.length ; i++) {
          for (var j = 0; j < response.data.features[i].geometry.coordinates[0].length; j++) {
            console.log(response.data.features[i].geometry.coordinates[0][j])
            var rest = inside([-50.644255, -23.182629], response.data.features[i].geometry.coordinates[0][j])
            if(rest) {
              console.log(rest)
              console.log(response.data.features[i].properties)
              res.json({ dados: response.data.features[i].properties })
              return
            }
          }
        } 
  }).catch(error => {
    console.log(error);
  });
app.post('/', function(req, res) {
  console.log(req.body)
  console.log(req.data)
  
})
})

