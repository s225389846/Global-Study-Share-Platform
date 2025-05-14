const Answer = require("../models/Answer");
const Question = require("../models/question");
const User = require("../models/user");

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: { email: "Email is already in use" } });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getUsers(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      roles = ["user", "admin"],
    } = req.query;
    if (req.user.role === "user") {
      return res.status(403).json({ message: "Access denied" });
    }
    const allowedRoles = req.user.role === "super-admin" ? roles : ["user"];

    const query = {
      role: { $in: allowedRoles },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, current_password, new_password } = req.body;

    if (req.user.role === "user" && req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    const updatedData = {};
    if (name) updatedData.name = name;

    if (current_password && new_password) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.comparePassword(current_password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      updatedData.password = new_password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role === "admin") {
      const userToDelete = await User.findById(id);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }
      if (userToDelete.role !== "user") {
        return res
          .status(403)
          .json({
            message: 'Admins can only delete users with the role "user"',
          });
      }
    } else if (req.user.role !== "super-admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getUserDetails(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const questions = await Question.find({ author: id });
    const answers = await Answer.find({ author: id });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        questions,
        answers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getUserDetails,
};
