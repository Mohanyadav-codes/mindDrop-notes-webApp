import express from 'express'
import { loginUser, registerUser} from '../controllers/authControllers.js'

const router = express.Router()

// when a POST request hits  / signup run register user 
router.post('/signup', registerUser);

// when a POST request hits / login run loginuser
router.post('/login', loginUser)

export default router