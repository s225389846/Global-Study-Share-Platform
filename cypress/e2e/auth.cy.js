describe("User Authentication - Registration and Login", () => {
  const uniqueId = Date.now();
  const testUser = {
    name: "Test User",
    email: `test_${uniqueId}@example.com`,
    password: "TestPass123",
  };

  it("should register a new user successfully", () => {
    cy.visit("http://localhost:3000/templates/user/user-register.html");

    cy.get("#name").type(testUser.name);
    cy.get("#email").type(testUser.email);
    cy.get("#password").type(testUser.password);
    cy.get("#confirmPassword").type(testUser.password);

    cy.get("#registerForm").submit();

    cy.on("window:alert", (text) => {
      expect(text).to.include("Registration successful");
    });
  });

  it("should fail registration with mismatched passwords", () => {
    cy.visit("http://localhost:3000/templates/user/user-register.html");

    cy.get("#name").type("Another User");
    cy.get("#email").type(`wrongpass_${uniqueId}@example.com`);
    cy.get("#password").type("12345678");
    cy.get("#confirmPassword").type("wrongpass");

    cy.get("#registerForm").submit();

    cy.on("window:alert", (text) => {
      expect(text).to.include("Passwords do not match");
    });
  });

  it("should login successfully with registered credentials", () => {
    cy.visit("http://localhost:3000/");

    cy.get("#email").type(testUser.email);
    cy.get("#password").type(testUser.password);

    cy.get("#login-form").submit();

    cy.url().should(
      "include",
      "http://localhost:3000/templates/user/user-dashboard.html"
    );
  });

  it("should fail login with incorrect password", () => {
    cy.visit("http://localhost:3000/");

    cy.get("#email").type(testUser.email);
    cy.get("#password").type("WrongPass123");

    cy.get("#login-form").submit();

    cy.on("window:alert", (text) => {
      expect(text).to.include("Invalid Credentials");
    });
  });

  it("should fail login with unregistered email", () => {
    cy.visit("http://localhost:3000/");

    cy.get("#email").type("notarealuser@example.com");
    cy.get("#password").type("SomePassword");

    cy.get("#login-form").submit();

    cy.on("window:alert", (text) => {
      expect(text).to.include("Invalid Credentials");
    });
  });

  it("should fail login with empty fields", () => {
    cy.visit("http://localhost:3000/");

    cy.get("#email").clear();
    cy.get("#password").clear();

    cy.get("#login-form").submit();

    cy.on("window:alert", (text) => {
      expect(text).to.include("Invalid Credentials");
    });
  });
});
