describe('/poll', () => {
  beforeEach('should have correct update form', () => {
    cy.exec('npm run db:reset');
    cy.exec('npm run db:seed');
    cy.visit('/login');

    cy.get('input[name="_csrf"]').then($input => {
      const csrfToken = $input.attr('value');
      cy.request('POST', '/login', {
        email: Cypress.env('email'),
        password: Cypress.env('password'),
        _csrf: csrfToken,
      });
    });
  });

  describe('/poll/:id', () => {
    beforeEach(() => {
      cy.visit('/poll/all');
    });

    it('should show a poll', () => {
      cy.contains('Vote').click();
    });
  });

  describe('/poll/all', () => {
    beforeEach(() => {
      cy.visit('/poll/all');
    });

    it('should show all polls', () => {
      cy.get('body');
    });
  });

  describe('/poll/vote', () => {
    const option = 'BC';

    beforeEach(() => {
      cy.visit('/poll/new');
      cy.get('input[name="pollName"]').type("Anton's poll");
      cy.get('textarea[name="pollOptions"]').type(`AB\n${option}\nCD`);
      cy.contains('Create').click();
    });

    it('should show a poll by an id', () => {
      cy.get('.message').should('contain', 'Poll submitted');
      cy.contains('View poll').click();
    });

    it('should cast a vote on a poll', () => {
      cy.get('.message').should('contain', 'Poll submitted');
      cy.contains('View poll').click();

      cy.get('select').select(option);
      cy.contains('Vote').click();
    });
  });

  describe('/poll/new', () => {
    beforeEach(() => {
      cy.visit('/poll/new');
    });

    it('should register a new poll', () => {
      cy.get('input[name="pollName"]').type("Anton's poll");
      cy.get('textarea[name="pollOptions"]').type('AB\nBC\nCD');
      cy.contains('Create').click();

      cy.get('.message').should('contain', 'Poll submitted');
    });
  });
});
