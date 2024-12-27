import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req, res) => {
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
    return true;
  } catch (err) {
    return res.status(403).send({ message: "Invalid or malformed token" });
  }
};
