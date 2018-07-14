describe("/register", () => {
  before(() => {
    cy.exec("npm run db:reset");
  });

  beforeEach(() => {
    cy.visit("/register");
  });

  it("should have proper /register <form>", () => {
    cy.title().should("include", "Register");
    cy.get("form").within(() => {
      cy.get("input").should("have.length", 8);
      cy.get("input:first").should($input => {
        expect($input.attr("name")).to.equal("_csrf");
        expect($input.val()).to.be.a("string");
      });
    });
  });

  it("should be able to register on /register", () => {
    cy.get("input[name=name]").type(Cypress.env("name"));
    cy.get("input[name=email]").type(Cypress.env("email"));
    cy.get("input[name=password]").type(`${Cypress.env("password")}`);
    cy.get("input[name=passwordRepeat]").type(
      `${Cypress.env("passwordRepeat")}{enter}`
    );

    cy.get(".message")
      .should("be.visible")
      .within($message => {
        expect($message).to.contain("Success");
        expect($message).to.contain("You are now logged in!");
      });

    cy.get("nav").within(() => {
      cy.get('[href="/profile"]').should("be.visible");
      cy.get(".button").should("contain", "Logout");
    });
    cy.exec("npm run db:reset");
  });

  it("should not be able to register on /register with wrong name", () => {
    cy.get("input[name=name]").type(Cypress.env("wrongName"));
    cy.get("input[name=email]").type(Cypress.env("email"));
    cy.get("input[name=password]").type(`${Cypress.env("password")}`);
    cy.get("input[name=passwordRepeat]").type(
      `${Cypress.env("passwordRepeat")}{enter}`
    );

    cy.get(".message")
      .should("be.visible")
      .within($message => {
        expect($message).to.contain("Error");
        expect($message).to.contain(
          "Please enter only unaccented alphabetical letters, A–Z or a–z"
        );
      });

    cy.get("form").within($form => {
      expect($form.find(".help")).to.contain(
        "Please enter only unaccented alphabetical letters, A–Z or a–z"
      );
      expect($form.find('[name="name"]')).to.have.class("is-danger");
      expect($form.find('[name="email"]')).to.have.class("is-success");
    });

    cy.get("nav").within(() => {
      cy.get('[href="/profile"]').should("not.be.visible");
      cy.get(".button").should("contain", "Login");
    });
  });

  it("should not be able to register on /register with wrong email", () => {
    cy.get("input[name=name]").type(Cypress.env("name"));
    cy.get("input[name=email]").type(Cypress.env("wrongEmail"));
    cy.get("input[name=password]").type(`${Cypress.env("password")}`);
    cy.get("input[name=passwordRepeat]").type(
      `${Cypress.env("passwordRepeat")}{enter}`
    );

    cy.get(".message")
      .should("be.visible")
      .within($message => {
        expect($message).to.contain("Error");
        expect($message).to.contain("Must be a correct email");
      });

    cy.get("form").within($form => {
      expect($form.find(".help")).to.contain("Must be a correct email");
      expect($form.find('[name="name"]')).to.have.class("is-success");
      expect($form.find('[name="email"]')).to.have.class("is-danger");
    });

    cy.get("nav").within(() => {
      cy.get('[href="/profile"]').should("not.be.visible");
      cy.get(".button").should("contain", "Login");
    });
  });

  it("should not be able to register on /register with not matching passwords", () => {
    cy.get("input[name=name]").type(Cypress.env("name"));
    cy.get("input[name=email]").type(Cypress.env("email"));
    cy.get("input[name=password]").type(`${Cypress.env("wrongPassword")}`);
    cy.get("input[name=passwordRepeat]").type(
      `${Cypress.env("passwordRepeat")}{enter}`
    );

    cy.get(".message")
      .should("be.visible")
      .within($message => {
        expect($message).to.contain("Error");
        expect($message).to.contain("Passwords do not match");
      });

    cy.get("form").within($form => {
      expect($form.find(".help")).to.contain("Passwords do not match");
      expect($form.find('[name="name"]')).to.have.class("is-success");
      expect($form.find('[name="email"]')).to.have.class("is-success");
      expect($form.find('[name="password"]')).to.have.class("is-danger");
      expect($form.find('[name="passwordRepeat"]')).to.have.class("is-danger");
    });

    cy.get("nav").within(() => {
      cy.get('[href="/profile"]').should("not.be.visible");
      cy.get(".button").should("contain", "Login");
    });
  });

  it("should not be able to register on /register with incorrect password", () => {
    cy.get("input[name=name]").type(Cypress.env("name"));
    cy.get("input[name=email]").type(Cypress.env("email"));
    cy.get("input[name=password]").type(`${Cypress.env("wrongPassword")}`);
    cy.get("input[name=passwordRepeat]").type(
      `${Cypress.env("wrongPassword")}{enter}`
    );

    cy.get(".message")
      .should("be.visible")
      .within($message => {
        expect($message).to.contain("Error");
        expect($message).to.contain(
          "Password must be at least 5 characters long and contain one number"
        );
      });

    cy.get("form").within($form => {
      expect($form.find(".help")).to.contain(
        "Password must be at least 5 characters long and contain one number"
      );
      expect($form.find('[name="name"]')).to.have.class("is-success");
      expect($form.find('[name="email"]')).to.have.class("is-success");
      expect($form.find('[name="password"]')).to.have.class("is-danger");
      expect($form.find('[name="passwordRepeat"]')).to.have.class("is-danger");
    });

    cy.get("nav").within(() => {
      cy.get('[href="/profile"]').should("not.be.visible");
      cy.get(".button").should("contain", "Login");
    });
  });
});
