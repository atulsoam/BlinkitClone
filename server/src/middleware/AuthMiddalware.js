import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]; // Correct way to access header

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization token is required" });
  }

  const actualToken = token.split(" ")[1]; // Extract the token part after "Bearer"
  if (!actualToken) {
    return res
      .status(401)
      .send({ message: "Authorization token is missing or malformed" });
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.ACCESS_TOKEN_SECRATE); // Replace with your secret key
    req.user = decoded; // Attach the decoded user data to the request object
    // next(); // Call next() to pass control to the next middleware or route handler
    return true
  } catch (err) {
    console.log(err);
    
    return res.status(403).send({ message: "Invalid or malformed token" });
  }
};

export const verifyTokenmiddleWare = (req, res, next) => {
  const token = req.headers["authorization"]; // Correct way to access header

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization token is required" });
  }

  const actualToken = token.split(" ")[1]; // Extract the token part after "Bearer"
  if (!actualToken) {
    return res
      .status(401)
      .send({ message: "Authorization token is missing or malformed" });
  }

  try {
    const decoded = jwt.verify(actualToken, process.env.ACCESS_TOKEN_SECRATE); // Replace with your secret key
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Call next() to pass control to the next middleware or route handler
    // return true
  } catch (err) {
    console.log(err);
    
    return res.status(403).send({ message: "Invalid or malformed token" });
  }
};