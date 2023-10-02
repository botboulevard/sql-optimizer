const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const app = express()
const port = process.env.PORT || 3000
const apiProxy = httpProxy.createProxyServer()
const apiServerPort = process.env.API_SERVER_PORT || "http://localhost:5000"

apiProxy.on('error', (err, req, res) => {
  console.log(err);
  res.status(500).send('Proxy error.')
})

app.all('/api/*', (req, res) => {
  console.log(req.path)
  console.log(`Forwarding API request to http://localhost:${apiServerPort}`)
  apiProxy.web(req, res, { target: apiServerPort })
})

app.use(express.static(path.join(__dirname, 'build')))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})