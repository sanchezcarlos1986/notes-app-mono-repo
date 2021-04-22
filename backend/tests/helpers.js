import { app } from "../index";
import supertest from "supertest";

export const api = supertest(app);

export const initialNotes = [
  { content: "nota 1 de ひらがな", important: true, date: new Date() },
  { content: "nota 2 de カタカナ", important: true, date: new Date() },
  { content: "nota 3 de 日本語", important: true, date: new Date() },
];

export const initialUsers = [
  {
    name: "Carlos Sánchez",
    username: "カルロス",
    password: "1234",
  },
];

export const getAllContentFromNotes = async () => {
  const response = await api.get("/api/notes");
  return {
    contents: response.body.map((note) => note.content),
    response,
  };
};

export const getAllUsers = async () => {
  const response = await api.get("/api/users");
  return {
    usernames: response.body.map((user) => user.username),
    response,
  };
};
