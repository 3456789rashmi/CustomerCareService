const { validationResult } = require("express-validator");

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorArray = errors.array();

    // If there's only one error, show that specific message
    if (errorArray.length === 1) {
      return res.status(400).json({
        success: false,
        message: errorArray[0].msg,
      });
    }

    // Multiple errors - show all of them
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorArray.map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};
