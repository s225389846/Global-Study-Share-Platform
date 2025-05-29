document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user")); 

  if (!token || !currentUser || !currentUser._id) {
    console.warn("User not logged in or user ID not found. Real-time notifications disabled.");
    return;
  }

  // Connecting to the Socket.IO server
  const socket = io("http://localhost:3000"); // 

  socket.on("connect", () => {
    console.log("Connected to WebSocket server with ID:", socket.id);
   
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server.");
  });

  // Listen for the 'newAnswerNotification' event from the server
  socket.on("newAnswerNotification", (data) => {
    console.log("Received new answer notification:", data);

    // Check if this notification is for the currently logged-in user
    if (currentUser._id === data.questionAuthorId) {
      const notificationMessage = `Your question "${data.questionTitle}" has a new answer from ${data.answerAuthorName}!`;
      alert(notificationMessage); // Simple alert for demonstration

      
       showToast(notificationMessage, data.questionId);

      //  updating a notification count (if you have a bell icon)
       updateNotificationBell();
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.IO connection error:", error);
  });
});

