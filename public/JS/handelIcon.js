document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  const userId = JSON.parse(atob(token.split(".")[1])).id;

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const userName = data.user?.name || "User";

      const userNameSpan = document.querySelector("#user-name");
      if (userNameSpan) {
        userNameSpan.textContent = userName;
      }
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
});
