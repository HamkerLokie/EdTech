import mongoose from 'mongoose'

const likesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'content',
    required: true
  }
})


export default mongoose.model('Likes', likesSchema)

