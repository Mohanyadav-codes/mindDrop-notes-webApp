import Note from '../models/notes.model.js'

// get all notes for the user (READ)
export const getNotes = async(req, res) => {
    try{
        // find notes where user field matches the currently logged in user's ID
        // .sort({createdAt: -1}) brings the newest notes first 
        const notes = await Note.find({user: req.user._id}).sort({ createdAt: -1})
        res.json(notes)
    } catch(error){
        res.status(500).json({message: 'server error'})
    }
};

// create a new note (CREATE)
export const createNote = async (req, res) => {
    try{
        const{title, content, tags, isPinned} = req.body

        if(!title || !content) {
            return res.status(400).json({message: 'please provide title and content'})
        }
        const note = new Note({
            user: req.user._id,
            title,
            content,
            tags,
            isPinned
        })

        const createdNote = await note.save()
        res.status(201).json(createdNote)
    } catch (error) {
        res.status(401).json({message: 'Server Error'})
    }
}

// Update a Note (UPDATE)
export const updateNote = async (req, res) => {
    try{
        const {title, content, tags, isPinned} = req.body

        // find the note by the Id provided in the URL
        const note = await Note.findById(req.params.id)

        if(!note){
            return res.status(404).json({message: 'not found'})
        }

        // make sure user == user trying to update
        if (note.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: 'user not authorized to view this'})
        }

        //update fields
        note.title = title || note.title
        note.content = content || note.content
        note.tags = tags !== undefined ? tags: note.tags
        note.isPinned = isPinned !== undefined ? isPinned: note.isPinned

        const updatedNote = await note.save()
        res.json(updatedNote)
    }   catch(error){
        res.status(401).json({message: 'server error'})
    }
}

// delete a note (DELETE)

export const deleteNote = async (req, res) => {
    try{
        const note = await Note.findById(req.params.id)

        if(!note){
            return res.status(401).json({message: 'note not found'})
        }

        // security check 
        if(note.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'ha ha tu hai hi ni pakda gaya'})
        }

        await note.deleteOne()
        res.json({message: 'delete kar diya haha'})
    } catch(error){
        res.status(401).json({message:'server Error'})
    }
};