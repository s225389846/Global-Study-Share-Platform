describe("User Post Creation", () => {
  const loginUrl = "http://localhost:3000/api/auth/login";
  const postPage = "http://localhost:3000/templates/user/create-post.html";
  const testUser = {
    email: "trilo1@gmail.com",
    password: "trilo1",
  };

  let token = "";

  beforeEach(() => {
    cy.request({
      method: "POST",
      url: loginUrl,
      body: {
        email: testUser.email,
        password: testUser.password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;

      cy.visit(postPage, {
        onBeforeLoad(win) {
          win.localStorage.setItem("token", token);
          win.localStorage.setItem("role", "user");
        },
      });
    });
  });

  it("should create a post successfully", () => {
    const postTitle = `Test Post ${Date.now()}`;
    const postContent = "This post is created by Cypress test.";

    cy.get("#postTitle").should("exist").type(postTitle);
    cy.get("#postContent").type(postContent);
    cy.get("#createPostForm").submit();

    cy.get("#postMessage", { timeout: 10000 }).should(
      "contain",
      "Post created successfully"
    );
  });

  it("should show error for empty fields", () => {
    cy.get("#postTitle").clear();
    cy.get("#postContent").clear();
    cy.get("#createPostForm").submit();

    cy.get("#postMessage")
      .should("contain", "All fields are required.")
      .and("have.class", "text-danger");
  });
});
