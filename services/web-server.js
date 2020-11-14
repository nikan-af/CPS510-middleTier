const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server');
const morgan = require('morgan');
const rtsIndex = require('../routes/index.router');
const cors = require('cors');
const bodyParser = require('body-parser');

let httpServer;

const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);

        app.use(morgan('combined'));

        app.use(bodyParser.json());

        app.use(cors(corsOpts));

        app.use('/api', rtsIndex);

        httpServer.listen(webServerConfig.port, err => {
            if (err) {
                reject(err);
                return;
            }
        });

        console.log(`Web server listening on localhost:${webServerConfig.port}`);

        resolve();
    })
}

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

module.exports.initialize = initialize;
module.exports.close = close;