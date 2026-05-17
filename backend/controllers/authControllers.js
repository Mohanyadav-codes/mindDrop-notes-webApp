import User from '../models/user.model.js' 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// JWT token generation 
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'}); // this shows sign through user id with JWT secret which we have and expiry
}

// sign-up kloo ------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10); // Generates random characters to mix with the password
    const hashedPassword = await bcrypt.hash(password, salt); // Mixes them together securely

    // 3. Create the user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Send success response back to frontend
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id), // Handing them their digital ID card!
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// -- Login kloo -----
export const loginUser = async(req, res) => {
    try{
        const{email, password} = req.body
        console.log("LOGIN ATTEMPT -> Email:", email, "| Password:", password);

        // 1. find the user by email
        const user = await User.findOne({email});

        // 2. check if the user exist and passowrd matches the hashed password
        if(user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            })
        } else{
            res.status(401).json({message:'invalid email or password'})
        }
    }catch(error){
        res.status(500).json({message: 'server error', error: error.message})
    }
}