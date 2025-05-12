const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const questions = await Question.find({ userId });
    const answers = await Answer.find({ userId });

    res.status(200).json({
      user,
      questions,
      answers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { current_password, new_password, email, ...updateData } = req.body;

    if (email) {
      return res.status(400).json({ message: "Email cannot be updated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (current_password && new_password) {
      const isMatch = await user.comparePassword(current_password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      updateData.password = new_password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
