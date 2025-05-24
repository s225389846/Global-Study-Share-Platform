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
    const questions = result.data;

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
              <button type="button" class="btn cmt"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">Comment</button>
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="staticBackdropLabel">Comments</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div class="user-comment"> 
                        <div class="user-name"> <i class="fas fa-user-circle"></i> Trilochan </div>
                        <div clasS="user-ans"> This is the answer. </div>
                      </div>
                      <div class="user-comment"> 
                        <div class="user-name"> <i class="fas fa-user-circle"></i> Trilochan </div>
                        <div clasS="user-ans"> This is the answer. </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                    <div class="chat-input-area" data-dashlane-rid="832076f5afbd1aca" data-dashlane-classification="other">
                     <form> 
                        <input type="text" id="user-comments" placeholder="Type your comment...">
                        <button>Send</button>
                     </form>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
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
