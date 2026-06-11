class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture the stack trace to help us debug where the error happened
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorResponse;