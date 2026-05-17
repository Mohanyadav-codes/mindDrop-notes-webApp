import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Make sure this path matches your files!

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in the headers and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token (Splits "Bearer eyJhbG..." into just the token)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database and attach them to the request (minus the password)
      req.user = await User.findById(decoded.id).select('-password');

      // 5. Let them in!
      next();
    } catch (error) {
      console.error("Middleware Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};