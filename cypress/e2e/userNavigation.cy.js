describe("User Dashboard Sidebar Navigation", () => {
  const baseUrl = "http://localhost:3000";

  // Simulate user being logged in
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("token", "dummy-jwt-token");
      win.localStorage.setItem("role", "user");
    });

    cy.visit(`${baseUrl}/templates/user/user-dashboard.html`);
  });

  it("should navigate to Home (Dashboard) page", () => {
    cy.get('a[href="user-dashboard.html"]').click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/user/user-dashboard.html"
    );
  });

  it("should navigate to Create Post page", () => {
    cy.get('a[href="create-post.html"]').click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/user/create-post.html"
    );
    cy.get("#createPostForm").should("exist");
  });

  it("should navigate to News Feed page", () => {
    cy.get('a[href="user-feed.html"]').click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/user/user-feed.html"
    );
  });

  it("should navigate to Own Feed page", () => {
    cy.get('a[href="own-feed.html"]').click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/user/own-feed.html"
    );
  });
});
