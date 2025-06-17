class ErrorHandler extends Error {
  constructor(message: any, statusCode: Number) {
    super(message);

    Error.captureStackTrace(statusCode);
  }
}

export default ErrorHandler;
