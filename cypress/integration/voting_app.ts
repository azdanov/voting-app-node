describe('Voting App', () => {
  it('should assert that <title> is correct', () => {
    cy.visit('/');
    cy.title().should('include', 'Voting App');
  });
});
