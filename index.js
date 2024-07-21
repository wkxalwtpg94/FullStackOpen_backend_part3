const express = require('express')
const app = express()

var morgan = require("morgan")

app.use(express.json())

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
    response.json(persons)
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
    const person = request.body
    const personMatch = persons.find((p) => p.name === person.name )
    
    if (!person.name) {
        return response.status(400).json({
            error: "name missing"
        })
    } else if (personMatch) {
        return response.status(400).json({
            error:"name already exists in the phonebook"
        })
    }
    

    person.id = Math.round(Math.random() * 1000000000)
    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})