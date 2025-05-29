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
        const questionId = question._id;

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
              <button class="btn cmt" data-bs-toggle="modal" data-bs-target="#commentModal-${questionId}">Comment</button>
              <button class="btn delete">Delete</button>
            </div>
          </div>

          <!-- Comment Modal -->
          <div class="modal fade" id="commentModal-${questionId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content chat-input">
                <div class="modal-header">
                  <h5 class="modal-title">Comments</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body comments-body" id="comments-${questionId}">
                  <p>Loading comments...</p>
                </div>
                <div class="modal-footer chat-input-area">
                  <form class="comment-form d-flex" data-id="${questionId}">
                    <input type="text" class="form-control" placeholder="Type your comment..." required />
                    <button type="submit" class="">Send</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        `;

        feedContainer.appendChild(col);

        // Delete button functionality
        const deleteBtn = col.querySelector(".btn.delete");
        deleteBtn.addEventListener("click", async () => {
          const confirmed = confirm(
            "Are you sure you want to delete this post?"
          );
          if (!confirmed) return;

          try {
            const deleteResponse = await fetch(`/api/questions/${questionId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!deleteResponse.ok) {
              throw new Error(
                `Failed to delete post: ${deleteResponse.status}`
              );
            }

            col.remove();
            if (feedContainer.children.length === 0) {
              feedContainer.innerHTML = "<p>No posts by you yet.</p>";
            }
          } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
          }
        });

        // Load comments when comment modal opens
        const modal = col.querySelector(`#commentModal-${questionId}`);
        modal.addEventListener("show.bs.modal", () => {
          loadComments(questionId);
        });
      }

      // Handle comment submission
      document.querySelectorAll(".comment-form").forEach((form) => {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const questionId = form.getAttribute("data-id");
          const input = form.querySelector("input");
          const body = input.value.trim();
          if (!body) return;

          try {
            const res = await fetch("/api/answers", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ body, question: questionId }),
            });

            if (res.ok) {
              input.value = "";
              loadComments(questionId);
            } else {
              console.error("Failed to submit comment");
            }
          } catch (err) {
            console.error("Comment submit error:", err);
          }
        });
      });

      async function loadComments(questionId) {
        const container = document.getElementById(`comments-${questionId}`);
        container.innerHTML = "<p>Loading...</p>";

        try {
          const res = await fetch(`/api/questions/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { answers } = await res.json();
          if (!answers.length) {
            container.innerHTML = "<p>No comments yet.</p>";
            return;
          }

          container.innerHTML = "";
          for (const ans of answers) {
            const userName = ans.author?.name || "Anonymous";
            const div = document.createElement("div");
            div.className = "user-comment mb-2";
            div.innerHTML = `
              <div class="user-name"><i class="fas fa-user-circle"></i> ${userName}</div>
              <div class="user-ans">${ans.body}</div>
            `;
            container.appendChild(div);
          }
        } catch (err) {
          console.error("Error loading comments:", err);
          container.innerHTML = "<p>Error loading comments.</p>";
        }
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      feedContainer.innerHTML = "<p>Failed to load posts. Please refresh.</p>";
    }
  }

  loadUserPosts();
});
