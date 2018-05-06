describe('/poll', () => {
  let pollNumber = 0;

  before(() => {
    cy.exec('npm run db:seed');
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
      cy.visit('/poll');
    });

    it('should show the first poll when logged out', () => {
      cy.contains('Logout').click();
      cy.visit('/poll');
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

      cy.visit('/poll');
      cy.contains('View').click();
      cy
        .get('main .section form')
        .children()
        .should('have.length', 2);
    });
  });

  describe('/poll', () => {
    beforeEach(() => {
      cy.visit('/poll');
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

  describe('/poll/edit', () => {
    let pollName = '';
    const newPollName = "Anton's new poll";
    const pollOptions = 'AB\r\nBC\r\nCD';
    const newPollOptions = '1\r\n2\r\n3\r\n4';
    const option = 'BC';
    const newOption = '2';

    beforeEach(() => {
      cy.visit('/poll/new');
      pollName = "Anton's poll " + pollNumber++;
    });

    it('should access edit on my own poll', () => {
      cy.get('input[name="pollName"]').type(pollName);
      cy.get('textarea[name="pollOptions"]').type(pollOptions);
      cy.contains('Create').click();

      cy.contains('View poll').click();
      cy.contains('Edit Poll').click();

      cy.get('.input').should('have.have.attr', 'value', pollName);
      cy.get('.textarea').should('have.have.text', pollOptions);
    });

    it('should update my own poll', () => {
      cy.get('input[name="pollName"]').type(pollName);
      cy.get('textarea[name="pollOptions"]').type(pollOptions);
      cy.contains('Create').click();

      cy.contains('View poll').click();

      cy
        .get('select')
        .select(option)
        .parent()
        .parent()
        .parent()
        .parent()
        .submit();

      cy.contains('You have already voted on this poll!');

      cy.contains('Edit Poll').click();

      cy.get('.input').should('have.have.attr', 'value', pollName);
      cy.get('.textarea').should('have.have.text', pollOptions);

      cy
        .get('input[name="pollName"]')
        .clear()
        .type(newPollName);
      cy
        .get('textarea[name="pollOptions"]')
        .clear()
        .type(newPollOptions);

      cy.contains('Update').click();

      cy.contains('View poll').click();

      cy.get('h1.title').should('have.text', newPollName);
      cy
        .get('select')
        .children()
        .should('have.have.length', 5);
      cy
        .get('select')
        .select(newOption)
        .parent()
        .parent()
        .parent()
        .parent()
        .submit();
      cy.contains('You have already voted on this poll!');
    });
  });

  describe('/poll/delete', () => {
    const pollName = "Anton's poll " + pollNumber++;
    const pollOptions = 'AB\r\nBC\r\nCD';

    beforeEach(() => {
      cy.visit('/poll/new');
    });

    it('should delete my own poll', () => {
      cy.get('input[name="pollName"]').type(pollName);
      cy.get('textarea[name="pollOptions"]').type(pollOptions);
      cy.contains('Create').click();

      cy.contains('View poll').click();

      cy.contains('Delete Poll').click();
      cy.contains('Poll deleted successfully');
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

      cy
        .get('select')
        .select(option)
        .parent()
        .parent()
        .parent()
        .parent()
        .submit();

      cy.get('select').should('have.value', option);
      cy.get('.help').should('contain', 'You have already voted on this poll!');
    });
  });
});
