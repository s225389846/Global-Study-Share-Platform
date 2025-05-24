// Login Integration from backend
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (!loginForm) {
    console.warn("login-form not found on this page.");
    return;
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const role = (data.user?.role || "").toLowerCase().trim();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        if (role === "super-admin") {
          window.location.href = "/templates/cms/admin-panel.html";
        } else if (role === "admin") {
          window.location.href = "/templates/cms/admin-panel.html";
        } else {
          window.location.href = "/templates/user/user-dashboard.html";
        }
      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
