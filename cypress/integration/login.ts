describe('/login', () => {
  before(() => {
    cy.exec('npm run db:seed');
  });

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should have proper /login <form>', () => {
    cy.title().should('include', 'Login');
    cy.get('form').within(() => {
      cy.get('input').should('have.length', 5);
      cy.get('input:first')
        .should('not.be.visible')
        .and($input => {
          expect($input.attr('name')).to.equal('_csrf');
          expect($input.val()).to.be.a('string');
        });
      cy.contains('Register').should('have.attr', 'href', '/register');
    });
  });

  it('should be able to login on /login', () => {
    cy.get('input[name=email]').type(Cypress.env('email'));
    cy.get('input[name=password]').type(`${Cypress.env('password')}{enter}`);
    cy.get('.message')
      .should('be.visible')
      .within($message => {
        expect($message).to.contain('Success');
        expect($message).to.contain('You are now logged in!');
      });

    cy.get('nav').within(() => {
      cy.get('[href="/profile"]').should('be.visible');
      cy.get('.button').should('contain', 'Logout');
    });
  });

  it('should not be able to login on /login with unregistered user', () => {
    cy.get('input[name=email]').type(Cypress.env('wrongEmail'));
    cy.get('input[name=password]').type(`${Cypress.env('wrongPassword')}{enter}`);
    cy.get('.message')
      .should('be.visible')
      .within($message => {
        expect($message).to.contain('Error');
        expect($message).to.contain('Failed Login!');
      });

    cy.get('input[name=email]').should('be.empty');
    cy.get('input[name=password]').should('be.empty');
  });

  it('should not be able to login on /login with registered user and wrong password', () => {
    cy.get('input[name=email]').type(Cypress.env('email'));
    cy.get('input[name=password]').type(`${Cypress.env('wrongPassword')}{enter}`);
    cy.get('.message')
      .should('be.visible')
      .within($message => {
        expect($message).to.contain('Error');
        expect($message).to.contain('Failed Login!');
      });

    cy.get('input[name=email]').should('be.empty');
    cy.get('input[name=password]').should('be.empty');
  });
});
