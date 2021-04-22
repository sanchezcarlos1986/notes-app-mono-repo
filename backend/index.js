import express from "express";
import cors from "cors";
import colorLog from "~utils/colorLog";
import notFound from "~middlewares/notFound";
import handleErrors from "~middlewares/handleErrors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import notesRouter from "~controllers/notes";
import usersRouter from "~controllers/users";
import loginRouter from "~controllers/login";
import testingRouter from "~controllers/testing";

const { NODE_ENV } = process.env;

const app = express();

// Sentry
Sentry.init({
  dsn:
    "https://4e3fa8b247824e98acadf73d2cd5322f@o568893.ingest.sentry.io/5714260",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// Initialize Mongo Connection
import "./mongo";

app.use(cors());
app.use(express.json());
app.use(express.static("../frontend/build"));

app.get("/api", (_, response) => response.send("<h1>HOLA MUNDO</h1>"));

// Routes
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/testing", testingRouter);

// Middlewares
app.use(Sentry.Handlers.errorHandler());
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  colorLog(
    "info",
    `🔥 Node Server running on PORT ${PORT} for "${NODE_ENV}" 🔥`
  )
);

export { app, server };
export default app;
