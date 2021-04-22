import express from "express";
import bcrypt from "bcrypt";
import User from "~models/User";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (request, response, next) => {
  const { username, password } = request.body;
  try {
    const user = await User.findOne({ username });
    const passwordCorrect = !user
      ? false
      : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      response.status(401).json({ error: "invalid user or password" });
    }

    const userForToken = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60 * 24 * 7,
    });
    // Expires in 7 days

    response.status(200).send({
      name: user.name,
      username: user.username,
      token,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
