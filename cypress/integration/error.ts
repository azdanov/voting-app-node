describe('/<error>', () => {
  it('should assert that error page is correct', () => {
    cy.visit('/non-existant-page', { failOnStatusCode: false });
    cy.title().should('include', 'Error');
    cy.contains('Back to Home Page').should('have.attr', 'href', '/');
  });
});
