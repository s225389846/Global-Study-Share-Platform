document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage.");
    return;
  }

  try {
    const response = await fetch("/api/questions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const questions = result.data; // ✅ Extract the `data` array

    console.log("Fetched questions:", questions);

    const feedContainer = document.querySelector(".post-feed .row");
    if (!feedContainer) {
      console.error("Feed container not found in the DOM.");
      return;
    }

    feedContainer.innerHTML = "";

    for (const question of questions) {
      const authorName = question.author?.name || "Unknown";

      const col = document.createElement("div");
      col.className = "col-md-8";

      col.innerHTML = `
          <div class="feed-box">
            <div class="feed-top">
              <div> <i class="fas fa-user-circle"></i>${authorName} </div>
              <div class="post-date">${new Date(
                question.createdAt
              ).toLocaleDateString()}</div>

            </div>
            <div class="feed-title">
              Title: ${question.title}
            </div>
            <div class="feed-mid">
              ${question.body}
            </div>
            <div class="feed-bottom">
              <button class="btn cmt">Comment</button>
              <button class="btn cmt">Report</button>
            </div>
          </div>
        `;

      feedContainer.appendChild(col);
    }
  } catch (error) {
    console.error("Error loading feed:", error);
  }
});
