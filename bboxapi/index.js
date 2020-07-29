var express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.get('/', (req, res) => res.send('BBox API Developed by Karpagam Institue of Technology for SIH 2020'))
const port = 3000
app.listen(port, () => console.log(`BBoxAPI app listening at http://localhost:${port}`))