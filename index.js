import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './routes/authRouter.js'

const app = express()
const port = process.env.PORT || 3000

const db = process.env.DB_NAME
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)
app.options('*', cors())
app.use(express.json())
app.use('/api', authRouter)


mongoose
  .connect(
    `mongodb+srv://${user}:${password}@cluster0.5qqffmc.mongodb.net/${db}?retryWrites=true&w=majority`,
  )
  .then(() => console.log('DB ok'))
  .catch(() => console.log('DB error'))

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
