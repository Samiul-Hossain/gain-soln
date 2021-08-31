const { model, Schema } = require('mongoose')

const studentSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  date_of_birth: String,
})

module.exports = model('Student', studentSchema)
