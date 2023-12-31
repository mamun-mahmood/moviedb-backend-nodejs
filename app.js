const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const movieRoutes = require("./routes/movieRoutes");
const tvShowRoutes = require("./routes/tvShowRoutes");
// Set up Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Movie/TV-show the API");
});
// middleware

// Routes
app.use("/auth", authRoutes);
app.use("/movies", authMiddleware, movieRoutes);
app.use("/tv-shows", authMiddleware, tvShowRoutes);
app.use("/reviews", authMiddleware, require("./routes/reviewRoutes"));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
