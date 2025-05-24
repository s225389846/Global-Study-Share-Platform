document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage.");
    return;
  }

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      console.error("Invalid token format");
      return null;
    }
  }

  const user = parseJwt(token);
  if (!user) {
    console.error("Cannot parse user info from token");
    return;
  }

  const loggedInUserId = user._id || user.id;
  if (!loggedInUserId) {
    console.error("User ID not found in token");
    return;
  }

  const feedContainer = document.querySelector(".post-feed .row");
  if (!feedContainer) {
    console.error("Feed container not found in the DOM.");
    return;
  }

  async function loadUserPosts() {
    feedContainer.innerHTML = "<p>Loading your posts...</p>";

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
      const questions = result.data || [];

      const ownQuestions = questions.filter(
        (q) => q.author?._id === loggedInUserId
      );

      feedContainer.innerHTML = "";

      if (ownQuestions.length === 0) {
        feedContainer.innerHTML = "<p>No posts by you yet.</p>";
        return;
      }

      for (const question of ownQuestions) {
        const authorName = question.author?.name || "Unknown";

        const col = document.createElement("div");
        col.className = "col-md-8";

        col.innerHTML = `
            <div class="feed-box">
              <div class="feed-top">
                <div><i class="fas fa-user-circle"></i> ${authorName}</div>
                <div class="post-date">${new Date(
                  question.createdAt
                ).toLocaleDateString()}</div>
              </div>
              <div class="feed-title">Title: ${question.title}</div>
              <div class="feed-mid">${question.body}</div>
              <div class="feed-bottom">
                <button class="btn cmt">Comment</button>
                <button class="btn delete">Delete</button>
              </div>
            </div>
          `;

        feedContainer.appendChild(col);

        const deleteBtn = col.querySelector(".btn.delete");
        deleteBtn.addEventListener("click", async () => {
          const confirmed = confirm(
            "Are you sure you want to delete this post?"
          );
          if (!confirmed) return;

          try {
            const deleteResponse = await fetch(
              `/api/questions/${question._id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!deleteResponse.ok) {
              throw new Error(
                `Failed to delete post: ${deleteResponse.status}`
              );
            }

            col.remove();

            if (feedContainer.children.length === 0) {
              feedContainer.innerHTML = "<p>No posts by you yet.</p>";
            }

            console.log("Post deleted successfully.");
          } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
          }
        });
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      feedContainer.innerHTML = "<p>Failed to load posts. Please refresh.</p>";
    }
  }

  loadUserPosts();
});
