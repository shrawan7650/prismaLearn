import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  try {
    const token =
      req.cookie?.token ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("token hai kya bhai", token);
    if (!token) {
      return res.status(401).send({ msg: "Access token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodedToken", decodedToken);

    req.userId = decodedToken.id;
    next();
  } catch (error) {
    res.status(401).send({ msg: error.message || "invalid access token" });
  }
};
