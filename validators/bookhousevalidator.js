exports.registerValidator = (request, response, next) => {
  request.check("username", "Username is required").notEmpty();
  request
    .check("email", "Email must be between 3 and 50")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 50
    });
  request.check("password", "Password is required").notEmpty();
  request
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain atleast 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain digit");

  const errors = request.validationErrors();
  if (errors) {
    const singleerror = errors.map(error => error.msg)[0];
    return response.status(400).json({ error: singleerror });
  }
  next();
};
