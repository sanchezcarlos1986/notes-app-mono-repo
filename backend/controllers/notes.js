import express from "express";
import Note from "~models/Note";
import User from "~models/User";
import userExtractor from "~middlewares/userExtractor";

const router = express.Router();

router.get("/", async (_, response) => {
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(notes);
});

router.get("/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end("Note not found");
      }
    })
    .catch(next);
  // this is like .catch(err => next(err))
});

router.post("/", userExtractor, async (request, response, next) => {
  try {
    const { content, important = false } = request.body;
    const { userId } = request;
    const user = await User.findById(userId);

    if (!content) {
      return response.status(400).json({
        error: "note.content is missing",
      });
    }

    const newNote = new Note({
      date: new Date(),
      important: important || false,
      content,
      user: user._id,
    });
    const savedNote = await newNote.save();

    // Relacionamos la nota guardada con el userId enviado en el body
    user.notes = user.notes.concat(savedNote._id);
    user.save();

    response.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;
  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => response.status(200).json(result))
    .catch(next);
});

router.delete("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    await Note.findByIdAndRemove(id);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
