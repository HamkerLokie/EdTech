import express from 'express'
import mongoose from 'mongoose'
import { APP_PORT, DB_URI } from './config'
import routes from './routes'
import errorHandler from './middleware/errorHandler'
import cors from 'cors'

const app = express()

mongoose.connect(DB_URI) //Portfolio- main email
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Database Connection Error'))
db.once('open', () => {
  console.log('Database Connected')
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

app.use(routes)

app.use(errorHandler)
app.listen(APP_PORT, () => {
  console.log(`Server Running on ${APP_PORT}`)
})
