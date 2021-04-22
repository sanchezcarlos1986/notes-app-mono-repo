import colorLog from "../utils/colorLog";

const { NODE_ENV } = process.env;
const ERROR_HANDLERS = {
  CastError: (response) =>
    response.status(400).send({ error: "id used is malformed" }),
  JsonWebTokenError: (response) =>
    response.status(401).json({ error: "Missing Token or Unauthorized user" }),
  TokenExpirerError: (response) =>
    response.status(401).json({ error: "Expired token" }),
  ValidationError: (response, error) =>
    response.status(409).json({ error: error.message }),
  defaultError: (response) => response.status(500).end(),
};

const handleErrors = (error, request, response, next) => {
  if (NODE_ENV === "development") {
    colorLog("error", "❌ handleErrors middleware ❌", {
      error,
      errorName: error.name,
    });
  }

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError;
  handler(response, error);
};

export default handleErrors;
