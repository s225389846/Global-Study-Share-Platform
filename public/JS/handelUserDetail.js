const apiUrl = "/api/users/681c75dfd05a0ef7ed38a62d";

// Fetch and populate user data on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch user data");

    const user = await response.json();
    document.getElementById("userName").value = user.name || "";
    document.getElementById("userEmail").value = user.email || "";
  } catch (error) {
    console.error("Error loading user profile:", error);
    document.getElementById("profileMessage").textContent =
      "Failed to load user data.";
    document.getElementById("profileMessage").classList.replace("text-success", "text-danger");
  }
});

// Update user profile on form submission
async function updateProfile(event) {
  event.preventDefault();

  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;

  const payload = { name, email };
  if (password.trim()) payload.password = password;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to update user data");

    document.getElementById("profileMessage").textContent =
      "Profile updated successfully!";
    document.getElementById("profileMessage").classList.replace("text-danger", "text-success");

    // Clear password field after successful update
    document.getElementById("userPassword").value = "";
  } catch (error) {
    console.error("Error updating profile:", error);
    document.getElementById("profileMessage").textContent =
      "Failed to update profile.";
    document.getElementById("profileMessage").classList.replace("text-success", "text-danger");
  }
}
