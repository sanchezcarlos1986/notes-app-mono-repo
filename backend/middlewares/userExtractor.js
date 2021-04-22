import jwt from "jsonwebtoken";

const userExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  let token = "";

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken?.id) {
    response.status(401).json({ error: "Missing Token or Unauthorized user" });
  }

  const { id: userId } = decodedToken;

  request.userId = userId;
  next();
};

export default userExtractor;
