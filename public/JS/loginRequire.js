window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/index.html";
  }
});
