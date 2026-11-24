const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {notFound, errorHandler} = require("./middleware/errorMiddleware");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();


//Middleware
app.use(cors({
    origin: process.env.CLIENT_URL
}));
app.use(express.json());

//Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (err) {
        console.error("MongoDB connection failed: ", err.message);
        process.exit(1);
    }
}

startServer();