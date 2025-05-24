// Reusable HTML loader with callback support
async function loadHTML(id, file, callback) {
  try {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;

    if (typeof callback === "function") {
      callback();
    }
  } catch (err) {
    console.error(`Failed to load ${file}:`, err);
  }
}

// Load sidebar and icon HTML fragments
loadHTML("user-nav", "user-nav.html");
loadHTML("user-icon", "user-icon.html", attachLogout);
loadHTML("admin-nav", "admin-nav.html");
loadHTML("admin-icon", "admin-icon.html", attachLogout);

// Logout binding function
function attachLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/";
    });
  } else {
    console.warn("Logout button not found!");
  }
}
