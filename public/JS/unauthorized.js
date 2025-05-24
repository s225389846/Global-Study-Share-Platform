window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || (role !== "super-admin" && role !== "admin")) {
    alert("Page Restricted");
    window.location.href = document.referrer || "/index.html";
    return;
  }

  loadAdmins();
});
