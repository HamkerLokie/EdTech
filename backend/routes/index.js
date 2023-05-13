import express from 'express'
import auth from '../middleware/auth'
import onlyTeacher from '../middleware/onlyTeacher'
import { Authentication, userController } from '../controllers'
const router = express.Router()

import upload from '../utils/multer'

router.post('/login', Authentication.login)
router.post('/register', Authentication.register)
router.get('/validateUser', auth, Authentication.validateUser)
router.get('/validateTeacher', auth, Authentication.validateTeacher)

router.post('/registerteacher', auth ,Authentication.registerTeacher)
router.post('/loginteacher', Authentication.loginTeacher)

router.post('/addlikes/:tutorId/:contentId', auth, userController.addLike)
router.post('/comment/:contentId/:tutorId', auth, userController.addComment)
router.post('/bookmark/:playId', auth, userController.addBookmark)
router.delete('/delcomment/:id', auth, userController.deleteComment)

router.post('/addPlaylist',  onlyTeacher, upload.single('thumb') ,userController.addPlaylist)
router.delete('/delPlaylist/:id',  onlyTeacher ,userController.deletePlaylist)


router.post('/addContent/:id',  onlyTeacher, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumb', maxCount: 1 }]) ,userController.addContent)
router.post('/addnotes/:id',  onlyTeacher, upload.fields([{ name: 'note', maxCount: 1 }, { name: 'thumb', maxCount: 1 }]) ,userController.addNotes)

router.get('/users', auth, Authentication.getAll)

router.get('/getAllTeachers', auth ,userController.getAllTeachers)

router.get('/getPlayListbyId', onlyTeacher, userController.getPlaylistbyId)
router.get('/teacherprofile/:teacherId', auth, userController.teachersProfile)
router.get('/studentprofile', auth, userController.studentProfile)

router.get('/getPlayListbyId/:playId', auth, userController.getPlaylistbyIduser)
router.get('/getAllPLaylists', auth, userController.getAllPLaylist)
router.get('/getContentbyId', onlyTeacher, userController.getContentbyId)
router.get('/getContentbyplayId/:playId', auth, userController.getContentbyPlayId)
router.get('/getNotesbyplayId/:playId', auth, userController.getNotesbyPlayId)


router.get('/comments/:contentId', auth, userController.getCommentsByContentID)


export default router
