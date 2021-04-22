import mongoose from "mongoose";
import { server } from "../index";
import Note from "~models/Note";
import { api, initialNotes, getAllContentFromNotes } from "./helpers";

beforeEach(async () => {
  await Note.deleteMany({});

  // sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }
});

describe("GET all notes", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test(`there are ${initialNotes.length} notes`, async () => {
    const { response } = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length);
  });

  test("the first note is about hiragana", async () => {
    const { contents } = await getAllContentFromNotes();
    expect(contents).toContain("nota 1 de ひらがな");
  });
});

test("an invalid new note can not be added", async () => {
  const newNote = {
    important: true,
    date: new Date(),
  };
  await api
    .post("/api/notes")
    .send(newNote)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const { response } = await getAllContentFromNotes();

  expect(response.body).toHaveLength(initialNotes.length);
});

test("a valid new note can be added", async () => {
  const newNote = {
    content: "new note about City Pop",
    important: true,
    date: new Date(),
  };
  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const { contents, response } = await getAllContentFromNotes();

  expect(response.body).toHaveLength(initialNotes.length + 1);
  expect(contents).toContain("new note about City Pop");
});

describe("DELETE notes", () => {
  test("a valid note can be deleted", async () => {
    const { response: firstResponse } = await getAllContentFromNotes();
    const [noteToDelete] = firstResponse.body;
    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const { contents, response } = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length - 1);
    expect(contents).not.toContain(noteToDelete.content);
  });

  test("an invalid note can not be deleted", async () => {
    await api.delete(`/api/notes/1234`).expect(400);

    const { response } = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
