const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Student = require("./models/Student");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const initialStudents = [
  {
    name: "Aisha",
    email: "aisha@gmail.com",
    course: "Computer Engineering",
  },
  {
    name: "Rahul",
    email: "rahul@gmail.com",
    course: "Information Technology",
  },
];

app.use(cors());
app.use(express.json());

const getStudentFields = (body) => {
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const course = typeof body?.course === "string" ? body.course.trim() : "";

  if (!name || !email || !course) {
    return {
      error: "Name, email, and course are required",
    };
  }

  return { name, email, course };
};

// Home route
app.get("/", (req, res) => {
  res.send("Student Management API is running");
});

// GET all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    return res.status(500).json({ message: "Error fetching students" });
  }
});

// POST - Add new student
app.post("/api/students", async (req, res) => {
  const fields = getStudentFields(req.body);
  if (fields.error) {
    return res.status(400).json({ message: fields.error });
  }

  try {
    const student = await Student.create(fields);
    return res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error.message);
    return res.status(500).json({ message: "Error creating student" });
  }
});

// PUT - Update student
app.put("/api/students/:id", async (req, res) => {
  const fields = getStudentFields(req.body);
  if (fields.error) {
    return res.status(400).json({ message: fields.error });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      fields,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(student);
  } catch (error) {
    console.error("Error updating student:", error.message);
    return res.status(500).json({ message: "Error updating student" });
  }
});

// DELETE - Delete student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({
      message: "Student deleted successfully",
      student,
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    return res.status(500).json({ message: "Error deleting student" });
  }
});

const startServer = async () => {
  try {
    await connectDB();
    if (await Student.countDocuments() === 0) {
      await Student.insertMany(initialStudents);
      console.log("Added the existing sample students to the empty database");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start backend:", error.message);
    process.exit(1);
  }
};

startServer();