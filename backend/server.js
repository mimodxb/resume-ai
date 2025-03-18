require("dotenv").config();
const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// ✅ Fix: Ensure CORS allows requests from frontend (port 3000)
app.use(cors({
    origin: "http://localhost:3000",  // Allows frontend requests
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ Ensure backend routes work
app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5001; // ✅ Ensure the backend is running on 5001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));