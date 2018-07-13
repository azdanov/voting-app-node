describe('/', () => {
  before(() => {
    cy.exec('npm run db:seed');
  });

  it('should assert that <title> is correct', () => {
    cy.visit('/');
    cy.title().should('include', 'Voting App');
  });

  it('should assert that <nav> is correct when logged out', () => {
    cy.visit('/');

    cy.get('nav').within(() => {
      cy.get('.navbar-brand').should('be.visible');
      cy.get('.button').should('be.visible');
      cy.contains('Home').should('have.attr', 'href', '/');
      cy.contains('Register').should('have.attr', 'href', '/register');
      cy.contains('Login').should('have.attr', 'href', '/login');
    });
  });

  it('should assert that <nav> is correct when logged in', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type(Cypress.env('email'));
    cy.get('input[name=password]').type(`${Cypress.env('password')}{enter}`);

    cy.get('nav').within(() => {
      cy.get('.navbar-brand').should('be.visible');
      cy.get('.button').should('be.visible');
      cy.contains('Home').should('have.attr', 'href', '/');
      cy.contains('Profile').should('have.attr', 'href', '/profile');
      cy.get('form').within(() => {
        cy.get('_csrf').should('not.be.visible');
        cy.get('button').should('have.text', 'Logout');
      });
    });
  });

  it('should show flash after logging out', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type(Cypress.env('email'));
    cy.get('input[name=password]').type(`${Cypress.env('password')}{enter}`);

    cy.get('.hero').within(() => {
      cy.get('.message').should('contain', 'You are now logged in!');
    });

    cy.contains('Logout').click();

    cy.get('.hero').within(() => {
      cy.get('.message').should('contain', 'You are now logged out!');
    });
  });

  it('should assert that flash messages are functional', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type(Cypress.env('email'));
    cy.get('input[name=password]').type(`${Cypress.env('password')}{enter}`);

    cy.get('.message')
      .should('be.visible')
      .within($message => {
        expect($message).to.contain('Success');
        expect($message).to.contain('You are now logged in!');
      });

    cy.get('.delete').click();
    cy.get('.message').should('not.be.visible');
  });
});
