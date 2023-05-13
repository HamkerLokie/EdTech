import Joi from 'joi'
import { User, Tutors } from '../../models'
import bcrypt from 'bcrypt'
import { SALT } from '../../config'
import JwtService from '../../services/JwtService'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const Authentication = {
  async register (req, res, next) {
    // Validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      confirm_password: Joi.ref('password')
    })

    const { error } = registerSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    // Check if user is in database?
    try {
      const exists = await User.exists({ email: req.body.email })
      if (exists) {
        return next(
          CustomErrorHandler.alreadyExists('This E-Mail already exists')
        )
      }
    } catch (err) {
      return next(err)
    }

    // Hash Password
    const { name, email, password } = req.body

    const hashedPass = await bcrypt.hash(password, Number(SALT))

    const user = new User({
      name,
      email,
      password: hashedPass
    })

    let access_token

    try {
      const result = await user.save()

      access_token = JwtService.sign({
        result
      })
    } catch (err) {
      return next(err)
    }
    console.log(access_token)
    res.json({ access_token })
  },

  async login (req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
    })

    const { email, password } = req.body

    const { error } = loginSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    try {
      //   Find User
      const user = await User.findOne({
        email
      })

      if (!user) {
        return next(
          CustomErrorHandler.notExists("User Doesn't Exists, Please Sign Up")
        )
      }
      // Comapre Password

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        return next(CustomErrorHandler.wrongPassword('Wrong Password'))
      }

      //   Token
      const access_token = JwtService.sign({
        _id: user._id,
        name: user.name,
        email: user.email
      })

      res.cookie('usercookie', access_token, {
        expires: new Date(Date.now() + 9000000),
        httpOnly: true
      })

      res.status(201).json({ user, access_token })
    } catch (err) {
      return next(err)
    }
  },

  async validateUser (req, res, next) {
    try {
      const validateOne = await User.findById(req.user._id).select('-__v -password')
      if (!validateOne) {
        return next(CustomErrorHandler.notFound('User not found'))
      }
      res.json(validateOne)
    } catch (error) {
      return next(error)
    }
  },
  async validateTeacher (req, res, next) {
    try {
      const validateOne = await Tutors.findById(req.user._id).select('-__v -password')
      if (!validateOne) {
        return next(CustomErrorHandler.notFound('User not found'))
      }
      res.json(validateOne)
    } catch (error) {
      return next(error)
    }
  },

  async getAll (req, res, next) {
    try {
      const allUSers = await User.find().select('-password -__v')

      if (allUSers.length === 0) {
        return res.json({ msg: 'No users' })
      }

      res.json(allUSers)
    } catch (error) {
      next(error)
    }
  },

  async registerTeacher (req, res, next) {
    // Validation
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      profession: Joi.string().min(3).max(30),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      confirm_password: Joi.ref('password')
    })

    const { error } = registerSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    // Check if user is in database?
    try {
      const exists = await Tutors.exists({ email: req.user.email })
      if (exists) {
        return next(
          CustomErrorHandler.alreadyExists('This E-Mail already exists')
        )
      }
    } catch (err) {
      return next(err)
    }

    // Hash Password
    const { name, email, password } = req.body

    const hashedPass = await bcrypt.hash(password, Number(SALT))

    const tutor = new Tutors({
      name,
      email,
      password: hashedPass
    })

    let access_token

    try {
      const result = await tutor.save()

      access_token = JwtService.sign({
        name: result.name,
        profession: result.profession,
        email: result.email
      })
    } catch (err) {
      return next(err)
    }
    res.json({ access_token })
  },

  async loginTeacher (req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
    })

    const { email, password } = req.body

    const { error } = loginSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    try {
      //   Find User
      const tutor = await Tutors.findOne({
        email
      })

      if (!tutor) {
        return next(
          CustomErrorHandler.notExists("User Doesn't Exists, Please Sign Up")
        )
      }
      // Comapre Password

      const match = await bcrypt.compare(password, tutor.password)

      if (!match) {
        return next(CustomErrorHandler.wrongPassword('Wrong Password'))
      }

      //   Token
      const access_token = JwtService.sign({
        _id: tutor._id,
        name: tutor.name,
        profession: tutor.profession,
        email: tutor.email
      })

      res.cookie('usercookie', access_token, {
        expires: new Date(Date.now() + 9000000),
        httpOnly: true
      })

      res.status(201).json({ access_token })
    } catch (err) {
      return next(err)
    }
  }
}

export default Authentication
