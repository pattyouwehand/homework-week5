const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const validation = (req, res, next) => {
  if(!req.body || req.body === ''){ 
    res.status(400).json({ message: 'Invalid input' })
  }else{
    next()
  }
}

let maxResponse = 0
const maxResponseMiddelware = (req, res, next) => {
  maxResponse = maxResponse + 1
  if(maxResponse > 5){
    res.status(429).end()
  }else{
    next()
  }
}

app.post('/messages', maxResponseMiddelware, (req, res) => {
  res.json({ message: "Message received loud and clear" })
})

app.use(validation)
app.use(bodyParser.json())
app.listen(port, () => console.log(`Listening on port ${port}`))