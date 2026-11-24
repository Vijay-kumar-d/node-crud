const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
}


const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
    let message = err.message || "Internal Server Error";

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }

    // Duplicate MongoDB field (e.g. unique email)
    if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate field value";
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development"
            ? { stack: err.stack }
            : {}),
    });
};


module.exports = {
    notFound,
    errorHandler,
}