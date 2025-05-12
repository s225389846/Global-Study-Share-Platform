async function loadHTML(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

loadHTML("header", "../templates/header.html");
loadHTML("footer", "../templates/footer.html");
