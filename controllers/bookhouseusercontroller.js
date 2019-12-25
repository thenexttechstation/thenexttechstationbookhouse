const BookHouseUser = require("../models/bookhouserusermodel");
const jsonToken = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.register = (request, response) => {
  console.log("request body", request.body);
  const bookhouseuser = new BookHouseUser(request.body);
  bookhouseuser.save((error, bookhouseuser) => {
    if (error) {
      return response.status(400).json({
        error
      });
    }
    response.json({
      bookhouseuser
    });
  });
};
exports.isAuth = (request, response, next) => {
  let bookhouseuser =
    request.profile && request.auth && request.profile._id == request.auth._id;
  if (!bookhouseuser) {
    return response.status(403).json({
      error: "Access denied"
    });
  }
  next();
};

exports.isadministrator = (request, response, next) => {
  if (request.profile.userrole === 0) {
    return response.status(403).json({
      error: "User is not administartor.Please contact admin for access"
    });
  }
  next();
};

exports.requireAuthentication = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

exports.logout = (request, response) => {
  response.clearCookie("token");
  response.json({
    message: "Signed out successfully"
  });
};

exports.createSocialUser = (request, response, next) => {
  console.log("inside  createSocialUser");
  // find the user based on email
  //const bookhouseuserdata = +JSON.stringify(request.body.bookhouseuser);
  const { email, password, username, provider } = request.body;
  //console.log("data" + bookhouseuserdata.email);
  console.log("request" + JSON.stringify(request.body));
  //const email = +JSON.stringify(+JSON.stringify(request.body).email);
  //console.log("bookhouseuser" + JSON.stringify(bookhouseuser));
  console.log("email" + email);

  console.log("inside  createSocialUser email" + email);

  BookHouseUser.findOne({ email }, (error, bookhouseuser) => {
    console.log("here");
    if (bookhouseuser) {
      console.log("data is there");
    }
    if (error || !bookhouseuser) {
      console.log("No data");
      const bookhouseusersave = new BookHouseUser();
      bookhouseusersave.email = email;
      bookhouseusersave.password = password;
      bookhouseusersave.username = username;
      bookhouseusersave.provider = provider;
      bookhouseusersave.save((error, bookhouseusersave) => {
        if (error) {
          return response.status(400).json({
            error
          });
        }
      });
      return response.status(400).json({
        error: error
      });
    }
    next();
  });
};

exports.login = (request, response) => {
  // find the user based on email
  const { email, password } = request.body;
  BookHouseUser.findOne({ email }, (error, bookhouseuser) => {
    if (error || !bookhouseuser) {
      return response.status(400).json({
        error: "User with that email does not exist. Please signup"
      });
    }

    if (!bookhouseuser.authenticate(password)) {
      return response.status(401).json({
        error: "Email and password dont match"
      });
    }
    // generate a signed token with user id and secret
    const signedtoken = jsonToken.sign(
      { _id: bookhouseuser._id },
      process.env.JWT_SECRET
    );
    // persist the token as 't' in cookie with expiry date
    response.cookie("token", signedtoken, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, username, email, userrole } = bookhouseuser;
    return response.json({
      signedtoken,
      bookhouseuser: { _id, email, username, userrole }
    });
  });
};
