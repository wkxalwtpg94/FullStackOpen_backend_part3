const mongoose = require('mongoose')

const password = process.argv[2]

const url =
`mongodb+srv://wkxalwtpg94:${password}@cluster0fso.gnlueui.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0fso`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  // eslint-disable-next-line no-unused-vars
  person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })


} else if (process.argv.length === 3) {

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

}


