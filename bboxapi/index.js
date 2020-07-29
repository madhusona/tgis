var express = require('express');
const bodyParser = require('body-parser');
const { Client, Query } = require('pg')
var cors = require('cors');

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();


app.get('/', (req, res) => res.send('BBox API Developed by Karpagam Institue of Technology for SIH 2020'))

app.get('/data', function (req, res) {
    
    if (!req.query.xmin && !req.query.ymin && !req.query.xmax && !req.query.ymax)
    {
        res.send('Send BBOX xmin, ymin, xmax, ymax')
        return;
    }
    console.log("ewrwer")
    var tower_query = "SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name','properties', json_build_object('name','EPSG:4326')),'features', json_agg(json_build_object('type','Feature','geometry',ST_AsGeoJSON(geom)::json,'properties', json_build_object('cell', cell,'long', long,'lat',lat)))) FROM towers WHERE geom && ST_SetSRID('BOX3D("+req.query.xmin+" "+req.query.ymin+","+req.query.xmax+" "+req.query.ymax+")'::box3d,4326)";
    var query = client.query(new Query(tower_query));
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
       // console.log(JSON.stringify(result.rows[0]))
        res.send(JSON.stringify(result.rows[0].json_build_object));       
        res.end();
    });
  });
  

app.listen(port, () => console.log(`BBoxAPI app listening at ${port}`))