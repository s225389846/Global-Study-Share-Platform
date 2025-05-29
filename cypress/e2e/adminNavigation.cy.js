describe("Admin Sidebar Navigation", () => {
  const adminCredentials = {
    email: "superadmin@admin.com",
    password: "admin123",
  };

  let token = "";

  before(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: {
        email: adminCredentials.email,
        password: adminCredentials.password,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      token = res.body.token;
    });
  });

  beforeEach(() => {
    Cypress.on("uncaught:exception", () => false);

    cy.visit("http://localhost:3000/templates/cms/admin-panel.html", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", token);
        win.localStorage.setItem("role", "super-admin");
      },
    });
  });

  it("Should navigate to Create Post page", () => {
    cy.get("a[href='create-admin-post.html']").click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/cms/create-admin-post.html"
    );
  });

  it("Should navigate to Reports page", () => {
    cy.get("a[href='report-post.html']").click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/cms/report-post.html"
    );
  });

  it("Should navigate to News Feed page", () => {
    cy.get("a[href='admin-feed.html']").click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/cms/admin-feed.html"
    );
  });

  it("Should navigate to Admin Posts page", () => {
    cy.get("a[href='admin-posts.html']").click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/cms/admin-posts.html"
    );
  });

  it("Should navigate to Admin List page", () => {
    cy.get("a[href='admin-list.html']").click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/cms/admin-list.html"
    );
  });

  it("Should navigate to User List page", () => {
    cy.get("a[href='user-list.html']").click();
    cy.url().should(
      "include",
      "http://localhost:3000/templates/cms/user-list.html"
    );
  });
});
