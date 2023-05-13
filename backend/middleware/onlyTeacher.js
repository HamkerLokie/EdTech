import CustomErrorHandler from '../services/CustomErrorHandler'
import JwtService from '../services/JwtService'

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized('No Token'))
  }
  const token = authHeader.split(' ')[1]

  try {
    const { _id, name, email, profession } = JwtService.verify(token)
    if (!profession) {
      return next(CustomErrorHandler.unAuthorized('Only For Teachers'))
    }

    const user = {
      _id,
      name,
      email,
      profession
    }

    req.user = user
    next()
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized('something Went Wrong in'))
  }
}

export default auth
