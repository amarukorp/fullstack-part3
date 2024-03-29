const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()

app.use(express.static('build'))

const Person = require('./models/person')

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :res[content-length] - :response-time ms :body'))

let phonebook = []

app.get('/api/persons', (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons)
	})
})

app.get('/api/info', (resquest, response) => {
	const amountOfPeople = phonebook.length
	const date = new Date()
	response.send(`<h2>Phonebook has info of ${amountOfPeople} people </h2>
              <h2>${date}</h2>`)
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))

	// const id = Number(request.params.id)
	// const person = phonebook.find((person) => person.id === id)
	// if (person) {
	// 	response.json(person)
	// } else {
	// 	response.status(404).end()
	// }
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		// eslint-disable-next-line no-unused-vars
		.then((result) => {
			response.status(204).end()
		})
		.catch((error) => next(error))

	// const id = Number(request.params.id)
	// phonebook = phonebook.filter((person) => person.id !== id)
	// console.log(phonebook)
	// response.status(204).end()
})

// const generateId = () => {
// 	const id = Math.floor(Math.random() * 100000 + 4)
// 	return id
// }

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	if (!body) {
		return response.status(400).json({
			error: 'content missing',
		})
	}

	// if (!person.name || !person.number) {
	// 	response.send({ error: 'The name or number is missing' })
	// }
	// let nameInspector = phonebook.find(
	// 	(currentPerson) => currentPerson.name === person.name
	// )

	// if (nameInspector) {
	// 	response.send({ error: 'The name already exists in the phonebook' })
	// }

	// phonebook = phonebook.concat(person)
	// response.json(person)

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson)
		})
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findByIdAndUpdate(
		request.params.id,
		{ name, number }
		// { new: true, runValidators: true, context: 'query' }
	)
		.then((updatedPerson) => {
			response.json(updatedPerson)
		})
		.catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
