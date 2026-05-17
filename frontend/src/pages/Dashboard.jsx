import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogOut, Plus, Sparkles, BookOpen, Calendar, Trash2, X, Search, Moon, Sun, Tag } from 'lucide-react';

// Pre-defined beautiful tags
const AVAILABLE_TAGS = [
  { name: 'Work', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30' },
  { name: 'Personal', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-500/30' },
  { name: 'Ideas', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30' },
  { name: 'Urgent', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-200 dark:border-red-500/30' }
];

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] });
  const [isFocused, setIsFocused] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); 
  
  // New State for Search and Dark Mode
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchNotes(token);
    
    // Check if user prefers dark mode from a previous visit
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);
  }, [navigate]);

  // Toggle Dark Mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const fetchNotes = async (token) => {
    try {
      const response = await axios.get('https://minddrop-notes-api.onrender.com/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('https://minddrop-notes-api.onrender.com/api/notes', newNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes([response.data, ...notes]);
      setNewNote({ title: '', content: '', tags: [] });
      setIsFocused(false);
    } catch (error) {
      alert("Failed to create note");
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`https://minddrop-notes-api.onrender.com/api/notes/${selectedNote._id}`, selectedNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.map(note => note._id === selectedNote._id ? response.data : note));
      setSelectedNote(null);
    } catch (error) {
      alert("Failed to update note");
    }
  };

  const handleDeleteNote = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://minddrop-notes-api.onrender.com/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notes.filter(note => note._id !== id));
      setSelectedNote(null);
    } catch (error) {
      alert("Failed to delete note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Helper function to toggle tags when creating a note
  const toggleTag = (tagName) => {
    if (newNote.tags.includes(tagName)) {
      setNewNote({ ...newNote, tags: newNote.tags.filter(t => t !== tagName) });
    } else {
      setNewNote({ ...newNote, tags: [...newNote.tags, tagName] });
    }
  };

  // Helper function to toggle tags when editing a note
  const toggleEditTag = (tagName) => {
    const currentTags = selectedNote.tags || [];
    if (currentTags.includes(tagName)) {
      setSelectedNote({ ...selectedNote, tags: currentTags.filter(t => t !== tagName) });
    } else {
      setSelectedNote({ ...selectedNote, tags: [...currentTags, tagName] });
    }
  };

  // Real-time Search Filter Logic
  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    const tags = note.tags || [];
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    // The master wrapper that controls Light/Dark mode
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 transition-colors duration-500 p-6 md:p-12 font-sans relative">
        <div className="max-w-7xl mx-auto">
          
          {/* --- PREMIUM NAVBAR --- */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/50 dark:border-gray-800 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight">
                  Mind<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Drop</span>
                </h1>
              </div>
              {/* Mobile controls */}
              <div className="flex md:hidden gap-2">
                <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 rounded-2xl transition-all outline-none"
              />
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 font-semibold transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* --- CREATOR SECTION --- */}
          <div className="flex justify-center mb-16 relative z-10">
            <form 
              onSubmit={handleCreateNote} 
              className={`w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl transition-all duration-500 border ${
                isFocused ? 'shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] border-indigo-100 dark:border-indigo-500/30 scale-[1.02]' : 'shadow-sm border-gray-100 dark:border-gray-800'
              }`}
            >
              <div className="p-6">
                {isFocused && (
                  <input 
                    type="text" 
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    className="w-full text-xl font-bold bg-transparent placeholder-gray-400 border-none focus:outline-none focus:ring-0 mb-4"
                    required
                  />
                )}
                <textarea 
                  placeholder="Take a note..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  onFocus={() => setIsFocused(true)}
                  className={`w-full bg-transparent placeholder-gray-500 dark:placeholder-gray-600 border-none focus:outline-none focus:ring-0 resize-none transition-all duration-300 ${
                    isFocused ? 'h-32 text-lg' : 'h-6 text-base font-medium'
                  }`}
                  required
                />
              </div>
              
              {isFocused && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-3xl border-t border-gray-50 dark:border-gray-800 gap-4">
                  {/* Tag Selector */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400 mr-1" />
                    {AVAILABLE_TAGS.map(tag => (
                      <span 
                        key={tag.name}
                        onClick={() => toggleTag(tag.name)}
                        className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-all ${
                          newNote.tags.includes(tag.name) ? tag.color : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <button 
                      type="button" 
                      onClick={() => setIsFocused(false)}
                      className="px-5 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      Close
                    </button>
                    <button 
                      type="submit" 
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Save Drop
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* --- NOTES GRID --- */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredNotes.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                <BookOpen className="w-20 h-20 text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-xl text-gray-400 dark:text-gray-600 font-medium">
                  {searchQuery ? "No notes found matching your search." : "Your mind is empty. Drop some thoughts!"}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div 
                  key={note._id} 
                  onClick={() => setSelectedNote(note)}
                  className="group bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:border-indigo-500/50 transition-all duration-300 cursor-pointer break-inside-avoid relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Display Tags on Card */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {note.tags.map(tagName => {
                        const tagObj = AVAILABLE_TAGS.find(t => t.name === tagName);
                        return tagObj ? (
                          <span key={tagName} className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tagObj.color}`}>
                            {tagName}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-3 leading-tight">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap line-clamp-8 leading-relaxed">
                    {note.content}
                  </p>
                  <div className="mt-6 flex justify-between items-center text-xs text-gray-400 font-semibold group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- READ/EDIT MODAL --- */}
          {selectedNote && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800">
                
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => handleDeleteNote(selectedNote._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedNote(null)}
                    className="p-2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateNote} className="p-8 flex-grow overflow-y-auto flex flex-col gap-4">
                  {/* Edit Tags */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Tag className="w-4 h-4 text-gray-400 mr-1" />
                    {AVAILABLE_TAGS.map(tag => (
                      <span 
                        key={`edit-${tag.name}`}
                        onClick={() => toggleEditTag(tag.name)}
                        className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-all ${
                          (selectedNote.tags || []).includes(tag.name) ? tag.color : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>

                  <input 
                    type="text" 
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
                    className="w-full text-3xl font-black bg-transparent border-none focus:outline-none focus:ring-0"
                    placeholder="Title"
                  />
                  <textarea 
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                    className="w-full h-64 text-lg text-gray-700 dark:text-gray-300 leading-relaxed bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
                    placeholder="Write your thoughts..."
                  />
                  <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto">
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;