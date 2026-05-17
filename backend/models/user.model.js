import mongoose, { mongo } from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minLength: 3
        },
        email: {
            type: String,
            required: true, 
            unique: true, 
            trim: true, 
            lowercase: true
        },
        password: {
            type: String,
            required: true, 
            minLength: 5
        }
    },
    {
        timestamps: true // Automatically adds createdAt and UpdatedAT dates !!
    }
)

const User = mongoose.model('User', userSchema);
export default User