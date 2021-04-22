import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { server } from "../index";
import User from "~models/User";
import { api, initialUsers, getAllUsers } from "./helpers";

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("1234", 10);

  for (const user of initialUsers) {
    const userObject = new User({ ...user, passwordHash });
    await userObject.save();
  }
});

describe("GET all users", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test(`there are ${initialUsers.length} users`, async () => {
    const { response } = await getAllUsers();
    expect(response.body).toHaveLength(initialUsers.length);
  });

  test(`the first username is ${initialUsers[0].username}`, async () => {
    const { usernames } = await getAllUsers();
    expect(usernames).toContain(initialUsers[0].username);
  });
});

test("an invalid new user can not be added", async () => {
  const newUser = {
    important: true,
    date: new Date(),
  };
  await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const { response } = await getAllUsers();

  expect(response.body).toHaveLength(initialUsers.length);
});

test("a valid new user can be added", async () => {
  const newUser = {
    name: "Miki Matsubara",
    username: "mikiM",
    password: "miki1234",
  };
  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const { usernames, response } = await getAllUsers();

  expect(response.body).toHaveLength(initialUsers.length + 1);
  expect(usernames).toContain(newUser.username);
});

test("usernames must be unique", async () => {
  const newUser = {
    name: "Mariya Takeuchi",
    username: "カルロス",
    password: "mariya1234",
  };
  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const { response } = await getAllUsers();

  expect(response.body).toHaveLength(initialUsers.length);
  expect(result.body.errors.username.message).toContain(
    "`username` to be unique"
  );
});

describe("DELETE users", () => {
  test("a valid user can be deleted", async () => {
    const { response: firstResponse } = await getAllUsers();
    const [userToDelete] = firstResponse.body;
    await api.delete(`/api/users/${userToDelete.id}`).expect(204);

    const { usernames, response } = await getAllUsers();
    expect(response.body).toHaveLength(initialUsers.length - 1);
    expect(usernames).not.toContain(userToDelete.username);
  });

  test("an invalid user can not be deleted", async () => {
    await api.delete(`/api/users/1234`).expect(400);

    const { response } = await getAllUsers();
    expect(response.body).toHaveLength(initialUsers.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
