function errorHandler(err, req, res, next) {
    console.error(err.message)
    if (err.name && err.name === "UnauthorizedError") {
        return res.status(401).json({ message: "The user is not authorized" });
    }
    return res.status(500).json({ message: "Server Error" });
}

module.exports = errorHandler;
