import React, { use } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = ()=>{
    // use usestate to hold the data user gives in the form
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    // This function updates the state whenever a user types a letter 
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    // on clicking submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try{
            // 1. Send the POST request to our Node.js backend
            const response = await axios.post('https://minddrop-notes-api.onrender.com/api/auth/signup', formData)

            // 2. If successful, save the token to the browser taki user login rhe
            localStorage.setItem('token', response.data.token)

            // 3. user to dashboard 
            navigate('/dashboard')
        } catch(error){
            alert(error.response?.data?.message || "something went wrong during signup")
        }
    }

    return(
        <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">MindDrop</h2>
        <p className="text-center text-gray-500 mb-8">Create an account to start taking notes.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="karmath jhujharu yuva"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
    )
}

export default Signup