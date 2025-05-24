document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createPostForm");
  const messageDiv = document.getElementById("postMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("postTitle").value.trim();
    const body = document.getElementById("postContent").value.trim();
    const token = localStorage.getItem("token");

    if (!title || !body) {
      messageDiv.textContent = "All fields are required.";
      messageDiv.classList.remove("text-success");
      messageDiv.classList.add("text-danger");
      return;
    }

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.textContent = "Post created successfully!";
        messageDiv.classList.remove("text-danger");
        messageDiv.classList.add("text-success");
        form.reset();
      } else {
        messageDiv.textContent = data.error || "Failed to create post.";
        messageDiv.classList.remove("text-success");
        messageDiv.classList.add("text-danger");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      messageDiv.textContent = "An error occurred while creating the post.";
      messageDiv.classList.remove("text-success");
      messageDiv.classList.add("text-danger");
    }
  });
});
