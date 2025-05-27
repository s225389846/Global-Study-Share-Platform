document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = user?.id;

  if (!token || !userId) {
    console.error("Login required");
    return;
  }

  try {
    const res = await fetch("/api/questions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data: questions } = await res.json();
    const feedContainer = document.querySelector(".post-feed .row");
    feedContainer.innerHTML = "";

    for (const question of questions) {
      const questionId = question._id;
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
            <button class="btn cmt" data-bs-toggle="modal" data-bs-target="#commentModal-${questionId}">Comment</button>
            <button class="btn cmt" data-bs-toggle="modal" data-bs-target="#reportModal-${questionId}">Report</button>
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
              <div class="modal-footer">
                <form class="chat-input-area d-flex" data-id="${questionId}">
                  <input type="text" class="form-control" placeholder="Type your comment..." required />
                  <button type="submit">Send</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Modal -->
        <div class="modal fade" id="reportModal-${questionId}" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Report Question</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form class="report-form" data-id="${questionId}">
                  <label for="reportReason-${questionId}" class="form-label">Reason for reporting:</label>
                  <input type="text" id="reportReason-${questionId}" class="form-control" required />
                  <button type="submit" class="btn btn-danger mt-3">Submit Report</button>
                  <div class="report-message text-success mt-2" style="display: none;"></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;

      feedContainer.appendChild(col);
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

    // Load comments when comment modal opens
    document.querySelectorAll("[id^='commentModal-']").forEach((modal) => {
      modal.addEventListener("show.bs.modal", () => {
        const questionId = modal.id.split("-")[1];
        loadComments(questionId);
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

    // Handle report submission
    document.querySelectorAll(".report-form").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const questionId = form.getAttribute("data-id");
        const reasonInput = form.querySelector("input");
        const reason = reasonInput.value.trim();
        const messageBox = form.querySelector(".report-message");

        if (!reason) return;

        try {
          const res = await fetch(`/api/questions/${questionId}/report`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reason }),
          });

          if (res.ok) {
            messageBox.textContent =
              "Question reported successfully. Thank you.";
            messageBox.style.display = "block";
            reasonInput.value = "";
          } else {
            messageBox.textContent = "Failed to submit report.";
            messageBox.classList.remove("text-success");
            messageBox.classList.add("text-danger");
            messageBox.style.display = "block";
          }
        } catch (err) {
          console.error("Report submit error:", err);
          messageBox.textContent = "Something went wrong.";
          messageBox.classList.remove("text-success");
          messageBox.classList.add("text-danger");
          messageBox.style.display = "block";
        }
      });
    });
  } catch (err) {
    console.error("Feed load error:", err);
  }
});
