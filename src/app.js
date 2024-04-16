const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use(require("./Router/Usuarios"));
app.use(require("./Router/Ingresos"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(`Error ${err}`);
    res.status(500).json({
        message: "Algo salió mal",
        error: err
    });
});

let server; // This variable will hold the server instance.

module.exports = {
    start: (port) => {
        // Start the server on the specified port (default: 3001)
        server = app.listen(port || 3001, () => {
            console.log(`Server running on port ${port || 3001}`);
        });
    },
    stop: () => {
        // Stop the server
        server.close(() => {
            console.log("Server stopped");
        });
    }
};

module.exports=app;