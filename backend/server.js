// import dependencies that were installed
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'

// load env file
dotenv.config()

// initialize the express application 
const app = express()

// setup middlewares
app.use(cors({
    origin:"*",
    credentials: true
})) // allows react frontend to connect with the backend 
app.use(express.json()) // tells express to parse incoming JSON data from requests
app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes);

// connect to mongoose 
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongoDb connected successfully')
    }) 
    .catch((err) => {
        console.error('mongoDB connection error', err)
    })

// create basic test route 
app.get('/', (req, res) => {
    res.send('Minddrop is Running')
})

// start the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}` )
})