const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "MulterError") {
        statusCode = 400;

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File too large. Maximum allowed size is 5MB.";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected file field. Use 'file' or 'assignment'.";
        }
    }

    // Log the full error for debugging (server-side only)
    console.error(err.stack || err);

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;