import pkg from 'jsonwebtoken';
const { verify } = pkg;

export default (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Unauthorize" });

  verify(token, "your_secret_key", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    req.user = decoded;
    next();
  });
};
