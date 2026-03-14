const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage
let notes = [];

// Get all notes
app.get('/notes', (req, res) => {
    res.status(200).json(notes);
});

// Add new note
app.post('/notes', (req, res) => {
    const { note } = req.body;

    if (!note || note.trim() === '') {
        return res.status(400).json({
            error: "Note content is required"
        });
    }

    const newNote = {
        id: Date.now().toString(),
        text: note.trim(),
        createdAt: new Date()
    };

    notes.push(newNote);

    res.status(201).json(newNote);
});

// Delete note
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;

    notes = notes.filter(note => note.id !== id);

    res.json({ message: "Note deleted successfully" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});