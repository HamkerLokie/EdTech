import mongoose from 'mongoose'

const playlistSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumb: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'deactive',
    required: true
  }
})


export default mongoose.model('Playlist', playlistSchema)
