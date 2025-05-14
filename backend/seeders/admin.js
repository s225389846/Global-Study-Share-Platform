const User = require("../models/user");

async function seedSuperAdmin() {
  try {
    const defaultUser = {
      name: "Super Admin",
      email: "superadmin@admin.com",
      password: "admin123",
      role: "super-admin",
    };

    // Check if the user already exists
    const existingUser = await User.findOne({ email: defaultUser.email });

    if (!existingUser) {
      await User.create(defaultUser);
      console.log("Default admin user created");
    } else {
      console.log("Default admin user already exists");
    }
  } catch (err) {
    console.error("Failed to seed default user:", err.message);
  }
}

module.exports = seedSuperAdmin;
