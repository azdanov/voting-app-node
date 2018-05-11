describe('/password', () => {
  const newPassword = 'new123';

  before(() => {
    cy.exec('npm run db:reset');
  });

  it('reset password by email', () => {
    cy.visit('/register');
    cy.get('input[name=name]').type(Cypress.env('name'));
    cy.get('input[name=email]').type(Cypress.env('email'));
    cy.get('input[name=password]').type(`${Cypress.env('password')}`);
    cy.get('input[name=passwordRepeat]').type(`${Cypress.env('passwordRepeat')}{enter}`);

    cy.visit('/password/request');
    cy.get('input[name=email]').type(`${Cypress.env('email')}{enter}`);

    cy.contains('You have been emailed a password reset link.');
  });
});
