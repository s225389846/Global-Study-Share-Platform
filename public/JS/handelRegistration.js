//User Registration Integration
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          alert(Object.values(data.errors).join("\n"));
        } else {
          alert(data.error || "Registration failed.");
        }
        return;
      }

      alert("Registration successful!");

      window.location.href = "/";
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  });
