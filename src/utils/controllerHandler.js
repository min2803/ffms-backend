function handleRequest(fn, context) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message
                });
            }
            console.error(`${context} error:`, error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
}

module.exports = { handleRequest };
