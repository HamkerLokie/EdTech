import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
 
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Content',
      required: true
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Tutor',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    }
  });

export default mongoose.model('Comments', commentsSchema)
