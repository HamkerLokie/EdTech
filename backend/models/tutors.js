import mongoose from 'mongoose'

const tutorSchema = mongoose.Schema({
  name: String,
  profession: { type: String, default: 'Tutor' },
  email: String,
  password: String
})

export default mongoose.model('Tutor', tutorSchema)
