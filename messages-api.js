const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const loggingMiddleware = (req, res, next) => {
  if(!req.body || ''){ 
    res.status(404).end
  }else{
    next()
  }
}

let maxResponse = 0
const maxResponseMiddelware = (req, res, next) => {
  if(maxResponse > 5){
    res.status(404).send("Too Many Requests")
  }else{
    next()
  }
}

app.use(bodyParser.json())
app.post('/messages', maxResponseMiddelware, loggingMiddleware, (req, res) => {
  console.log(req.body)
  res.json({ message: "Message received loud and clear" })
})
app.listen(port, () => console.log(`Listening on port ${port}`))