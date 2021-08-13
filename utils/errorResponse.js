class errorResponse {
  constructor(message, statusCode) {
    // super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
class errorResponseWithExtend extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = errorResponseWithExtend;
