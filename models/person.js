const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
	.connect(url)
	.then((result) => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

// personSchema.set('toJSON', {
// 	transform: (document, returnedObject) => {
// 		returnedObject.id = returnedObject - _id.toString()
// 		delete returnedObject._id
// 		delete returnedObject.__v
// 	},
// })

module.exports = mongoose.model('Person', personSchema)
