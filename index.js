const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())
app.use(morgan('tiny'))

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

const generateId = () => {
  const id = Math.floor((Math.random() * 100000) + 4);
  return id
}

app.post('/api/persons', (request,response)=>{
  const body = request.body
  // console.log(body.content)

  if(!body){
    return response.status(400).json({
    error: 'content missing'
    })
  }
  const person = {
    id: generateId(),
    name: body.name, 
    number: body.number
  }
  if (!person.name || !person.number){
    response.send({error: 'The name or number is missing'})
  }
  let nameInspector = phonebook.find(currentPerson => currentPerson.name === person.name)

  if(nameInspector){
    response.send({error:'The name already exists in the phonebook'})
  }

  phonebook = phonebook.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
