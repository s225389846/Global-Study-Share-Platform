async function loadHTML(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

loadHTML("user-nav", "user-nav.html");
loadHTML("user-icon", "user-icon.html");
loadHTML("admin-nav", "admin-nav.html");
loadHTML("admin-icon", "admin-icon.html");
