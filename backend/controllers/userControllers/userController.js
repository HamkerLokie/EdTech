import {
  Bookmarks,
  Content,
  Like,
  Tutors,
  Playlist,
  Comments,
  Note
} from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const userController = {
  async teachersProfile (req, res, next) {
    try {
      const playlist = await Playlist.find({
        tutor: req.params.teacherId
      }).populate('tutor')
      const content = await Content.find({
        tutor: req.params.teacherId
      })
      const comments = await Comments.find({
        tutor: req.params.teacherId
      })
      const notes = await Note.find({
        tutor: req.params.teacherId
      })

      res.json({ playlist, content, comments, notes })
    } catch (error) {
      return next(error)
    }
  },
  async studentProfile (req, res, next) {
    try {
      
      const bookmarks = await Bookmarks.find({
        user: req.user._id
      })
      

      const comments = await Comments.find({
        user: req.user._id
      })

      res.json({ bookmarks, comments })
    } catch (error) {
      return next(error)
    }
  },

  async deleteComment (req, res, next) {
    try {
      const id = req.params.id
      const comment = await Comments.findByIdAndDelete({ _id: id })
      if (!comment) {
        return res.status(404).send({ message: 'Comment not found' })
      }
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },

  async addComment (req, res, next) {
    const userID = req.user._id
    const contentId = req.params.contentId
    const tutor = req.params.tutorId
    const comments = req.body.comment
    try {
      if (!userID || !contentId) {
        return next(CustomErrorHandler.notExists('Login To Add bookmark'))
      }

      const comment = new Comments({
        user: userID,
        content: contentId,
        comment: comments,
        tutor: tutor
      })
      try {
        await comment.save()
      } catch (error) {
        return next(error)
      }
      res.json({ msg: 'Saved' })
    } catch (error) {
      return next(error)
    }
  },
  async addBookmark (req, res, next) {
    const userID = req.user._id
    const playlistID = req.params.playId
    try {
      const bookmark = new Bookmarks({
        user: userID,
        playlist: playlistID
      })
      try {
        await bookmark.save()
      } catch (error) {
        return next(error)
      }
      res.json({ msg: 'Saved' })
    } catch (error) {
      return next(error)
    }
  },

  async addPlaylist (req, res, next) {
    let playlist

    try {
      playlist = new Playlist({
        tutor: req.user._id,
        title: req.body.title,
        description: req.body.description,
        thumb: req.file.path,

        status: req.body.status
      })

      // Save the playlist to the database
      const res = await playlist.save()
    } catch (err) {
      console.error('backend', err)
      res.status(500).send(err)
    }
    res.json({ playlist })
  },
  async deletePlaylist (req, res, next) {
    let id = req.params.id
    try {
      const deleted = await Playlist.findByIdAndDelete(id)
      await Content.deleteMany({ playlist: req.params.id })
      await Content.deleteMany({ playlist: req.params.id })
      await deleted.remove()
      res.send('Deleted')
    } catch (error) {
      next(error)
    }
  },

  async addContent (req, res, next) {
    try {
      const { title, description, date, status } = req.body
      const videoFilePath = req.files['video'][0].path
      const thumbFilePath = req.files['thumb'][0].path
      const newContent = new Content({
        tutor: req.user._id,
        playlist: req.params.id,
        title,
        description,
        video: videoFilePath,
        thumb: thumbFilePath,
        status
      })
      const savedContent = await newContent.save()
      res.status(201).json(savedContent)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  },
  async addNotes (req, res, next) {
    try {
      const { title, description, date, status } = req.body
      const noteFilePath = req.files['note'][0].path
      const thumbFilePath = req.files['thumb'][0].path
      const newContent = new Note({
        tutor: req.user._id,
        playlist: req.params.id,
        title,
        description,
        note: noteFilePath,
        thumb: thumbFilePath,
        status
      })
      const savedContent = await newContent.save()
      res.status(201).json(savedContent)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  },

  async addLike (req, res, next) {
    const userID = req.user._id
    const contentID = req.params.contentId
    const tutorID = req.params.tutorId

    if (!userID || !contentID || !tutorID) {
      return next(CustomErrorHandler.unAuthorized('Unauthorised to Like'))
    }

    const li = new Like({
      user: userID,
      tutor: tutorID,
      content: contentID
    })

    let saved

    try {
      saved = await li.save()
    } catch (error) {
      return next(error)
    }

    res.json(saved)
  },

  async getAllTeachers (req, res, next) {
    try {
      const teachers = await Tutors.find().select('-__v -password')
      res.json({ teachers })
    } catch (error) {
      return next(error)
    }
  },

  async getPlaylistbyId (req, res, next) {
    try {
      const playlist = await Playlist.find({ tutor: req.user._id }).select(
        '-__v -password'
      )
      res.json({ playlist })
    } catch (error) {
      return next(error)
    }
  },

  async getPlaylistbyIduser (req, res, next) {
    const playId = req.params.playId
    try {
      const playlist = await Playlist.findById(playId)
        .select('-__v -password')
        .populate('tutor')
      res.json({ playlist })
    } catch (error) {
      return next(error)
    }
  },

  async getContentbyId (req, res, next) {
    try {
      const content = await Content.find({ tutor: req.user._id })
        .select('-__v -password')
        .populate('playlist tutor')
      res.json({ content })
    } catch (error) {
      return next(error)
    }
  },
  async getContentbyPlayId (req, res, next) {
    try {
      const content = await Content.find({ playlist: req.params.playId })
        .select('-__v -password')
        .populate('playlist tutor')
      res.json({ content })
    } catch (error) {
      return next(error)
    }
  },
  async getNotesbyPlayId (req, res, next) {
    try {
      const content = await Note.find({ playlist: req.params.playId })
        .select('-__v')
        .populate('playlist tutor')
      res.json({ content })
    } catch (error) {
      return next(error)
    }
  },

  async getAllPLaylist (req, res, next) {
    try {
      const playlist = await Playlist.find()
        .select('-__v -password')
        .populate('tutor')
      res.json({ playlist })
    } catch (error) {
      return next(error)
    }
  },

  async getCommentsByContentID (req, res, next) {
    const contentID = req.params.contentId
    try {
      const comments = await Comments.find({ content: contentID })
        .select('-__v')
        .populate('user')
      res.json({ comments })
    } catch (error) {
      return next(error)
    }
  }
}

export default userController
