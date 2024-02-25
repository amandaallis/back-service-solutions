import jwt from "jsonwebtoken";
const auth = (request, response, next) => {
    try {
      const authorization = request.headers.authorization;
      if (!authorization) return response.status(401).send();
      const token = authorization.split(" ")[1];
      const payload = jwt.verify(token, process.env.SECRET);
      request.userId = payload.userId;
      next();
    } catch (error) {
      response.status(401).send();
    }
  };
export default auth;