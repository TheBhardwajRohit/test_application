const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // This loads the .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows cross-origin requests (from your app to the server)
app.use(express.json()); // Allows the server to accept JSON in request bodies

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Define a Schema and Model for Students ---
// This schema is based on the one you provided.
const studentSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
    name: {
      first: { type: String },
      last: { type: String },
    },
    studentID: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    // We can omit other fields for now to keep the API response clean,
    // but the model will still recognize them in the database.
  },
  { timestamps: true }
);


// The model is the tool you use to interact with the 'students' collection.
// Mongoose will look for a collection named "students" (plural, lowercase).
const Student = mongoose.model("Student", studentSchema);


// --- API Routes ---

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from the Hackathon Backend!');
});

// The main route for your app to get all students
app.get('/api/students', async (req, res) => {
  try {
    // Find all documents in the Student collection
    const students = await Student.find({});
    res.json(students); // Send the students back as JSON
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


