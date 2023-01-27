const express = require('express')
const app = express()

let phonebook = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
  
]

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/info', (resquest, response)=>{
  const amountOfPeople = phonebook.length
  const date = new Date()
  response.send(`<h2>Phonebook has info of ${amountOfPeople} people </h2>
              <h2>${date}</h2>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find(person => person.id === id)

  if(person){
    response.json(person)
  }
  else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  phonebook = phonebook.filter(person => person.id !== id)
  console.log(phonebook)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
