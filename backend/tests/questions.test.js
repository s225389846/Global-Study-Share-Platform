const request = require("supertest");
const app = require("../app");

// Mock controller methods
jest.mock("../controllers/questionController", () => ({
  getQuestions: (req, res) => {
    res.status(200).json({
      data: [{ _id: "q1", title: "Sample Question" }],
      currentPage: 1,
      totalPages: 1,
      totalQuestions: 1,
    });
  },
  createQuestion: (req, res) => {
    res.status(201).json({
      message: "Question created successfully",
      question: { _id: "q1", title: req.body.title },
    });
  },
  updateQuestion: (req, res) => {
    res.status(200).json({
      message: "Question updated successfully",
      question: { _id: req.params.id, title: req.body.title },
    });
  },
  deleteQuestion: (req, res) => {
    res.status(200).json({ message: "Question deleted successfully" });
  },
  getQuestionDetails: (req, res) => {
    res.status(200).json({
      question: { _id: req.params.id, title: "Question Title" },
      answers: [],
    });
  },
  addQuestionReport: (req, res) => {
    res.status(200).json({
      reason: req.body.reason,
      reportedBy: req.user._id,
    });
  },
}));

// Mock auth middleware
jest.mock("../middlewares/isAuthenticated", () => {
  return (req, res, next) => {
    req.user = { _id: "mockUser", role: "user" };
    next();
  };
});

describe("Question Routes (Mocked)", () => {
  it("GET /api/questions - should return list of questions", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0]).toHaveProperty("title", "Sample Question");
  });

  it("POST /api/questions - should create a question", async () => {
    const res = await request(app)
      .post("/api/questions")
      .send({ title: "New Q", body: "Content" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Question created successfully");
    expect(res.body.question).toHaveProperty("title", "New Q");
  });

  it("PUT /api/questions/:id - should update a question", async () => {
    const res = await request(app)
      .put("/api/questions/q1")
      .send({ title: "Updated Title" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Question updated successfully");
  });

  it("DELETE /api/questions/:id - should delete a question", async () => {
    const res = await request(app).delete("/api/questions/q1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Question deleted successfully");
  });

  it("GET /api/questions/:id - should return question details", async () => {
    const res = await request(app).get("/api/questions/q1");
    expect(res.statusCode).toBe(200);
    expect(res.body.question).toHaveProperty("title", "Question Title");
    expect(res.body.answers).toEqual([]);
  });

  it("POST /api/questions/:id/report - should add report to question", async () => {
    const res = await request(app)
      .post("/api/questions/q1/report")
      .send({ reason: "Spam" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("reason", "Spam");
  });
});
