/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin_fullstack:${password}@cluster0.hglhlge.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3]) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})

	// eslint-disable-next-line no-unused-vars
	person.save().then((result) => {
		console.log(
			`added ${process.argv[3]} number ${process.argv[4]} to phonebook`
		)
		mongoose.connection.close()
	})
}

if (!process.argv[3]) {
	Person.find({}).then((result) => {
		console.log('phonebook:')
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`)
			mongoose.connection.close()
		})
	})
}
