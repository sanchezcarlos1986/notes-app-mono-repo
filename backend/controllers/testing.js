import express from "express";
import Note from "~models/Note";
import User from "~models/User";

const router = express.Router();

router.post("/reset", async (request, response, next) => {
  try {
    await Note.deleteMany({});
    await User.deleteMany({});

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
