describe('/poll', () => {
  let pollNumber = 0;

  before(() => {
    cy.exec('npm run db:seed');
  });

  after(() => {
    cy.exec('npm run db:reset');
  });

  beforeEach('should have correct update form', () => {
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

    it('should show the first poll when logged out', () => {
      cy.contains('Logout').click();
      cy.visit('/poll/all');
      cy.contains('View').click();
      cy
        .get('main form')
        .children()
        .should('have.length', 3);
      cy.get('.help').should('contain', 'Please log in to participate in this poll!');
    });

    it('should show the first poll when logged in', () => {
      cy.visit('/login');

      cy.get('input[name="_csrf"]').then($input => {
        const csrfToken = $input.attr('value');
        cy.request('POST', '/login', {
          email: Cypress.env('email'),
          password: Cypress.env('password'),
          _csrf: csrfToken,
        });
      });

      cy.visit('/poll/all');
      cy.contains('View').click();
      cy
        .get('main form')
        .children()
        .should('have.length', 2);
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

  describe('/poll/new', () => {
    beforeEach(() => {
      cy.visit('/poll/new');
    });

    it('should register a new poll', () => {
      cy.get('input[name="pollName"]').type("Anton's poll " + pollNumber++);
      cy.get('textarea[name="pollOptions"]').type('AB\nBC\nCD');
      cy.contains('Create').click();

      cy.get('.message').should('contain', 'Poll submitted');
    });
  });

  describe('/poll/vote', () => {
    const option = 'BC';

    beforeEach(() => {
      cy.visit('/poll/new');
      cy.get('input[name="pollName"]').type("Anton's poll " + pollNumber++);
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
      cy.get('main form').submit();

      cy.get('select').should('have.value', option);
      cy.get('.help').should('contain', 'You have already voted on this poll!');
    });
  });
});
