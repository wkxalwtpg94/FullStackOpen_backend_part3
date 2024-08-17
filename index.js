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
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    
    if (body.name === undefined) {
        return response.status(400).json({
            error: "name missing"
        })
    } else {Person.exists({name: body.name})
              .then(exists => {
                if (exists) {
                  console.log("Name already exists, can use PUT request")
                  Person.findOneAndUpdate(
                    {name:body.name},
                    {number: body. number},
                    {new: true, runValidators: true}
                  )
                    .then(updatedPerson => {
                      response.json(updatedPerson)
                    })
                    .catch(error => {
                      console.error(error);
                      response.status(400).json({
                        error:"error updating phone number"
                      })
                    })
                  
                  
                } else {
                  console.log("time to create a new NAME")
                  const person = new Person ({
                    name: body.name,
                    number: body.number,
                  })

                  person.save().then(savedPerson => {
                    response.json(savedPerson)
                  })
                }
              })
    }    
})

  app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id"})
  }
  
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})