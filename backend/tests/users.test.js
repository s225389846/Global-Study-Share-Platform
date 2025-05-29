const request = require("supertest");
const app = require("../app");

// Mock the controller methods
jest.mock("../controllers/userController", () => ({
  getUsers: (req, res) =>
    res.status(200).json([{ id: "1", name: "Test User" }]),
  getUserDetails: (req, res) =>
    res.status(200).json({ id: req.params.id, name: "User Details" }),
  createUser: (req, res) =>
    res.status(201).json({ message: "User created", data: req.body }),
  updateUser: (req, res) =>
    res.status(200).json({ message: "User updated", id: req.params.id }),
  deleteUser: (req, res) =>
    res.status(200).json({ message: "User deleted", id: req.params.id }),
}));

// Mock isAuthenticated middleware
jest.mock("../middlewares/isAuthenticated", () => {
  return (req, res, next) => {
    req.user = { id: "mockUserId", role: "superadmin" };
    next();
  };
});

// Mock isSuperAdmin middleware
jest.mock("../middlewares/isSuperAdmin", () => {
  return (req, res, next) => {
    if (req.user && req.user.role === "superadmin") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
});

describe("User Routes (Mocked)", () => {
  it("GET /api/users - should return list of users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([{ id: "1", name: "Test User" }])
    );
  });

  it("GET /api/users/:id - should return user details", async () => {
    const res = await request(app).get("/api/users/123");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: "123", name: "User Details" });
  });

  it("POST /api/users - should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ name: "New User" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created");
    expect(res.body.data).toEqual({ name: "New User" });
  });

  it("PUT /api/users/:id - should update a user", async () => {
    const res = await request(app)
      .put("/api/users/123")
      .send({ name: "Updated Name" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User updated");
    expect(res.body).toHaveProperty("id", "123");
  });

  it("DELETE /api/users/:id - should delete a user", async () => {
    const res = await request(app).delete("/api/users/123");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted");
    expect(res.body).toHaveProperty("id", "123");
  });
});
