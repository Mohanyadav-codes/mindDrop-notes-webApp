import express from 'express'
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/noteControllers.js'
import {protect} from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getNotes)
router.post('/', protect, createNote)
router.put('/:id', protect, updateNote)
router.delete('/:id', protect, deleteNote)

export default router