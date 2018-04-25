describe('Voting App', () => {
  it('should assert that /test is working', () => {
    cy.request('/test').then(response => {
      expect(response.body).to.have.property('message', 'Hello World!');
    });
  });

  it('should assert that <title> is correct', () => {
    cy.visit('/');
    cy.title().should('include', 'Voting App');
  });

  it('should assert that <nav> is correct when logged out', () => {
    cy.visit('/');
    cy.get('nav').within(() => {
      cy.get('.navbar-brand').should('have.length', 1);
      cy.get('.button').should('have.length', 1);
    });
  });

  it('should have proper /login <form>', () => {
    cy.visit('/login');
    cy.get('form').within(() => {
      cy.get('input').should('have.length', 3);
      cy.get('input:first').and($input => {
        expect($input.attr('name')).to.equal('_csrf');
        expect($input.val()).to.be.a('string');
      });
      cy.get('button').should('have.length', 1);
    });
  });

  it('should not be able to login on /login', () => {
    cy.exec('npm run db:reset', { timeout: 20000 });
    cy
      .request('POST', '/login', {
        email: 'wrong',
        password: 'wrong',
      })
      .then(response => {
        expect(response.status).to.eq(200);
      });
    cy.visit('/');
    cy.get('nav').within(() => {
      cy.get('.navbar-brand').should('have.length', 1);
      cy.get('.button').should('have.length', 1);
    });
  });

  it('should be able to login on /login', () => {
    cy.exec('npm run db:reset', { timeout: 20000 });
    cy.exec('npm run db:seed', { timeout: 20000 });
    cy.visit('/login');
    console.log(Cypress.env('email'));
    cy
      .request('POST', '/login', {
        email: Cypress.env('email'),
        password: Cypress.env('password'),
      })
      .then(response => {
        console.log(response);
        expect(response.status).to.eq(200);
      });
    cy.visit('/');
    cy.get('nav').within(() => {
      cy.get('.navbar-brand').should('have.length', 1);
      cy.get('.button').should('contain', 'Logout');
    });
    cy.exec('npm run db:reset', { timeout: 20000 });
  });

  it('should be able to register on /register', () => {
    cy.exec('npm run db:reset', { timeout: 20000 });
    cy
      .request('POST', '/register', {
        email: Cypress.env('email'),
        name: Cypress.env('name'),
        password: Cypress.env('password'),
        passwordRepeat: Cypress.env('password'),
      })
      .then(response => {
        expect(response.status).to.eq(200);
      });
    cy.getCookie('connect.sid').should('exist');
    cy.exec('npm run db:reset', { timeout: 20000 });
  });

  it('should be able to register on /register and login on /login', () => {
    cy
      .request('POST', '/register', {
        email: Cypress.env('email'),
        name: Cypress.env('name'),
        password: Cypress.env('password'),
        passwordRepeat: Cypress.env('password'),
      })
      .then(response => {
        expect(response.status).to.eq(200);
      });
    cy
      .request('POST', '/login', {
        email: Cypress.env('email'),
        password: Cypress.env('password'),
      })
      .then(response => {
        expect(response.status).to.eq(200);
      });
    cy.visit('/');
    cy.get('nav').within(() => {
      cy.get('.navbar-brand').should('have.length', 1);
      cy.get('.button').should('contain', 'Logout');
    });
    cy.getCookie('connect.sid').should('exist');
    cy.exec('npm run db:reset', { timeout: 20000 });
  });

  it('should have proper /register <form>', () => {
    cy.visit('/register');
    cy.get('form').within(() => {
      cy.get('input').should('have.length', 5);
      cy.get('input:first').should($input => {
        expect($input.attr('name')).to.equal('_csrf');
        expect($input.val()).to.be.a('string');
      });
      cy.get('button').should('have.length', 2);
    });
  });
});
