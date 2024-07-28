const mongoose = require("mongoose")
const express = require('express')
const app = express()
var morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()
const Person = require("./models/person")

app.use(cors())
app.use(express.json())
app.use(express.static("dist"))

morgan.token("data", function (req, res) {
    const sliced = Object.fromEntries(
        Object.entries(req.body).slice(1)
    )
    
    return (JSON.stringify(sliced))
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))






let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`
    )
  })

app.get("/api/persons", (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })  
})

app.get(`/api/persons/:id`, (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    
    if (body.name === undefined) {
        return response.status(400).json({
            error: "name missing"
        })
    } 
    
    const person = new Person ({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    
})


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})