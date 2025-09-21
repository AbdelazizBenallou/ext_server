const successResponse = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

const errorResponse = (res, message = "Server error", statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const notFoundResponse = (res, message = "Resource not found") => {
  res.status(404).json({
    success: false,
    message,
  });
};

const badRequestResponse = (res, message = "Bad request") => {
  res.status(400).json({
    success: false,
    message,
  });
};


const cachedResponse = (res, data, cacheInfo = {}) => {
  res.status(200).json({
    success: true,
    ...cacheInfo,
    ...data,
  });
};

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  badRequestResponse,
  cachedResponse,
};
