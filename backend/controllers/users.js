import express from "express";
import bcrypt from "bcrypt";
import User from "~models/User";

const router = express.Router();

router.get("/", async (_, response, next) => {
  try {
    const users = await User.find({}).populate("notes", {
      content: 1,
      date: 1,
    });
    response.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (request, response, next) => {
  const user = request.body;
  const { name, username, password } = user;

  if (!name || !username) {
    return response.status(400).json({
      error: "name or username are missing",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    username,
    passwordHash,
  });

  try {
    const savedUser = await newUser.save();
    response.status(201).json(savedUser);
  } catch (err) {
    response.status(400).json(err);
  }
});

router.delete("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    await User.findByIdAndRemove(id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
