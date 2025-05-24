document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const userId = JSON.parse(atob(token.split(".")[1])).id;

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.user;

      // Set form values
      document.getElementById("userName").value = user.name || "";
      document.getElementById("userEmail").value = user.email || "";
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error loading user details:", error);
  }

  // Handle form submission
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
    };

    const password = document.getElementById("userPassword").value;
    if (password) {
      updatedData.password = password;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      const msgEl = document.getElementById("profileMessage");
      if (response.ok) {
        msgEl.textContent = "Profile updated successfully!";
        msgEl.classList.remove("text-danger");
        msgEl.classList.add("text-success");
      } else {
        msgEl.textContent = result.message || "Failed to update profile.";
        msgEl.classList.remove("text-success");
        msgEl.classList.add("text-danger");
      }
    } catch (error) {
      console.error("Update error:", error);
      const msgEl = document.getElementById("profileMessage");
      msgEl.textContent = "Error updating profile.";
      msgEl.classList.remove("text-success");
      msgEl.classList.add("text-danger");
    }
  });
});
