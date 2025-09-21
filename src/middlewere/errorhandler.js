const response = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return response.badRequestResponse(res, "Invalid JSON format");
  }

  return response.errorResponse(res, "Server error", 500);
};

module.exports = errorHandler;
