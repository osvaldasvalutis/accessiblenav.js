'use strict'

const express = require('express')
const path = require('path')
const app = express()
const appPort = 3000

app.use(express.static('./demo'))
app.use('/dist', express.static(path.join(`${__dirname}/dist/`)))
app.use('/', express.static(path.join(__dirname, '/demo')))

app.listen(appPort, () => {
  console.log(`Server started at localhost:${appPort}`)
});
