const jwt = require("jsonwebtoken");
const {
  handleRegister,
  handleLogin,
} = require("../controllers/authController");
const User = require("../models/User");

jest.mock("../models/User");

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("handleRegister", () => {
    it("should register new user", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      User.findOne.mockResolvedValue(null); // No existing user
      const saveMock = jest.fn();
      User.mockImplementation(() => ({
        ...req.body,
        save: saveMock,
        toJSON: () => ({ name: "Test User", email: "test@example.com" }),
      }));

      await handleRegister(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        data: { name: "Test User", email: "test@example.com" },
        message: "User registered successfully!",
      });
    });

    it("should return error if email already registered", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      User.findOne.mockResolvedValue({ email: "test@example.com" });

      await handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: "Email is already registered" },
      });
    });

    it("should return validation error if fields are missing", async () => {
      req.body = { name: "", email: "", password: "" };

      await handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.objectContaining({
            name: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
          }),
        })
      );
    });
  });

  describe("handleLogin", () => {
    it("should login and return token", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ _id: "user123", email: "test@example.com" }),
      };

      User.findOne.mockResolvedValue(mockUser);

      const token = jwt.sign(
        { id: mockUser._id },
        process.env.JWT_SECRET || "testsecret",
        {
          expiresIn: "30d",
        }
      );

      jest.spyOn(jwt, "sign").mockReturnValue(token);

      await handleLogin(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
      expect(res.json).toHaveBeenCalledWith({
        user: { _id: "user123", email: "test@example.com" },
        token,
      });
    });

    it("should return 401 if credentials are invalid", async () => {
      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockResolvedValue(mockUser);

      await handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });

    it("should return 401 if user not found", async () => {
      req.body = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      User.findOne.mockResolvedValue(null);

      await handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email or password",
      });
    });
  });
});
