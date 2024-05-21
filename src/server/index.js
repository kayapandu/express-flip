const express = require('express');
const bodyParser = require("body-parser");

const {
  http
} = require('../../config');

const routes = require('../routes');
const { errorHandler } = require('../utils');

console.log(http);

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({
      info: 'Hello world!'
  });
})

//router initialization
routes(app);


//router initialization
// routes(app);

//error handler
app.use(errorHandler);

app.listen(http.httpPort, () => console.log(`app running at http://localhost:${http.httpPort}`));