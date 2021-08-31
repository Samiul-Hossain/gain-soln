const { model, Schema } = require('mongoose')

const subjectSchema = new Schema({
  name: String,
  enrolled: [String],
})

module.exports = model('Subject', subjectSchema)
