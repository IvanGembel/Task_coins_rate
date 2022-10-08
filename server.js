const http = require('http');
const https = require('https');
const url = require("url");

const port = 3000;

const server = http.createServer((req, res) => {
res.setHeader('Content-Type', 'application/json');
const reqUrl = url.parse(req.url).pathname
if(reqUrl == "/rates") {
  const parsed = url.parse(req.url, true)
  if('currency' in parsed.query) {
    let resp
     req = https.get(`https://api.coincap.io/v2/rates/${parsed.query.currency}`, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        obj = JSON.parse(data)
        if ('data' in obj) {
          res.statusCode = 200;
          res.write(`{"usd": "${obj.data.rateUsd}"}`)
          res.end()
        }
        else {
          res.statusCode = 404;
          res.write('{"status": 404, "message": "Incorrect coin currency was set or information on coincap.io is missed."}')
          res.end()
        }
      });
    })
    req.on("error", (err) => {
      console.log("Error: " + err.message);
      res.statusCode = 404;
      res.write('{"status": 404, "message": "Incorrect coin currency was set"}')
      res.end()
    });
    req.end()

  }
  else {
    res.statusCode = 404;
    res.write('{ "status": 404, "message": "Query parameter currency not found." }')
    res.end()
  }
}
else {
  res.statusCode = 404;
  res.write('{ "status": 404, "message": "Route not found." }')
  res.end()
}
});

server.listen(port, () => {
console.log(`Server is running at http://0.0.0.0:${port}/`);
});
