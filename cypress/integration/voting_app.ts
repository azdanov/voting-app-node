describe('Voting App', () => {
  describe('/test', () => {
    it('should assert that /test is working', () => {
      cy.request('/test').then(response => {
        expect(response.body).to.have.property('message', 'Hello World!');
      });
    });
  });

  describe('/', () => {
    beforeEach(() => {
      cy.exec('npm run db:reset');
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
      cy.exec('npm run db:seed');

      cy.visit('/login');
      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('password')}{enter}`);

      cy.get('nav').within(() => {
        cy.get('.navbar-brand').should('be.visible');
        cy.get('.button').should('be.visible');
        cy.contains('Home').should('have.attr', 'href', '/');
        cy.contains('Profile').should('have.attr', 'href', '/profile');
        cy.contains('Logout').should('have.attr', 'href', '/logout');
      });
    });

    it('should assert that flash messages are functional', () => {
      cy.exec('npm run db:seed');

      cy.visit('/login');
      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('password')}{enter}`);

      cy
        .get('.message')
        .should('be.visible')
        .within($message => {
          expect($message).to.contain('Success');
          expect($message).to.contain('You are now logged in!');
        });

      cy.get('.delete').click();
      cy.get('.message').should('not.be.visible');
    });
  });

  describe('/login', () => {
    beforeEach(() => {
      cy.exec('npm run db:reset');
    });

    it('should have proper /login <form>', () => {
      cy.visit('/login');
      cy.title().should('include', 'Login');

      cy.get('form').within(() => {
        cy.get('input').should('have.length', 3);
        cy
          .get('input:first')
          .should('not.be.visible')
          .and($input => {
            expect($input.attr('name')).to.equal('_csrf');
            expect($input.val()).to.be.a('string');
          });

        cy.get('button').should('have.length', 1);
      });
    });

    it('should be able to login on /login', () => {
      cy.exec('npm run db:seed');

      cy.visit('/login');
      cy.title().should('include', 'Login');

      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('password')}{enter}`);
      cy
        .get('.message')
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
      cy.visit('/login');
      cy.title().should('include', 'Login');

      cy.get('input[name=email]').type(Cypress.env('wrongEmail'));
      cy.get('input[name=password]').type(`${Cypress.env('wrongPassword')}{enter}`);
      cy
        .get('.message')
        .should('be.visible')
        .within($message => {
          expect($message).to.contain('Error');
          expect($message).to.contain('Failed Login!');
        });

      cy.get('input[name=email]').should('be.empty');
      cy.get('input[name=password]').should('be.empty');
    });

    it('should not be able to login on /login with registered user and wrong password', () => {
      cy.exec('npm run db:seed');

      cy.visit('/login');
      cy.title().should('include', 'Login');

      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('wrongPassword')}{enter}`);
      cy
        .get('.message')
        .should('be.visible')
        .within($message => {
          expect($message).to.contain('Error');
          expect($message).to.contain('Failed Login!');
        });

      cy.get('input[name=email]').should('be.empty');
      cy.get('input[name=password]').should('be.empty');
    });
  });

  describe('/register', () => {
    beforeEach(() => {
      cy.exec('npm run db:reset');
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

    it('should be able to register on /register', () => {
      cy.visit('/register');
      cy.title().should('include', 'Register');

      cy.get('input[name=name]').type(Cypress.env('name'));
      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('password')}`);
      cy
        .get('input[name=passwordRepeat]')
        .type(`${Cypress.env('passwordRepeat')}{enter}`);

      cy
        .get('.message')
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

    it('should not be able to register on /register with wrong name', () => {
      cy.visit('/register');
      cy.title().should('include', 'Register');

      cy.get('input[name=name]').type(Cypress.env('wrongName'));
      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('password')}`);
      cy
        .get('input[name=passwordRepeat]')
        .type(`${Cypress.env('passwordRepeat')}{enter}`);

      cy
        .get('.message')
        .should('be.visible')
        .within($message => {
          expect($message).to.contain('Error');
          expect($message).to.contain('A name must consist of alphabetical characters');
        });

      cy.get('form').within($form => {
        expect($form.find('.help')).to.contain(
          'A name must consist of alphabetical characters',
        );
        expect($form.find('[name="name"]')).to.have.class('is-danger');
        expect($form.find('[name="email"]')).to.have.class('is-success');
      });

      cy.get('nav').within(() => {
        cy.get('[href="/profile"]').should('not.be.visible');
        cy.get('.button').should('contain', 'Login');
      });
    });

    it('should not be able to register on /register with wrong email', () => {
      cy.visit('/register');
      cy.title().should('include', 'Register');

      cy.get('input[name=name]').type(Cypress.env('name'));
      cy.get('input[name=email]').type(Cypress.env('wrongEmail'));
      cy.get('input[name=password]').type(`${Cypress.env('password')}`);
      cy
        .get('input[name=passwordRepeat]')
        .type(`${Cypress.env('passwordRepeat')}{enter}`);

      cy
        .get('.message')
        .should('be.visible')
        .within($message => {
          expect($message).to.contain('Error');
          expect($message).to.contain('Must be a correct email');
        });

      cy.get('form').within($form => {
        expect($form.find('.help')).to.contain('Must be a correct email');
        expect($form.find('[name="name"]')).to.have.class('is-success');
        expect($form.find('[name="email"]')).to.have.class('is-danger');
      });

      cy.get('nav').within(() => {
        cy.get('[href="/profile"]').should('not.be.visible');
        cy.get('.button').should('contain', 'Login');
      });
    });

    it('should not be able to register on /register with not matching passwords', () => {
      cy.visit('/register');
      cy.title().should('include', 'Register');

      cy.get('input[name=name]').type(Cypress.env('name'));
      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('wrongPassword')}`);
      cy
        .get('input[name=passwordRepeat]')
        .type(`${Cypress.env('passwordRepeat')}{enter}`);

      cy
        .get('.message')
        .should('be.visible')
        .within($message => {
          expect($message).to.contain('Error');
          expect($message).to.contain('Passwords do not match');
        });

      cy.get('form').within($form => {
        expect($form.find('.help')).to.contain('Passwords do not match');
        expect($form.find('[name="name"]')).to.have.class('is-success');
        expect($form.find('[name="email"]')).to.have.class('is-success');
        expect($form.find('[name="password"]')).to.have.class('is-danger');
        expect($form.find('[name="passwordRepeat"]')).to.have.class('is-danger');
      });

      cy.get('nav').within(() => {
        cy.get('[href="/profile"]').should('not.be.visible');
        cy.get('.button').should('contain', 'Login');
      });
    });

    it('should not be able to register on /register with incorrect password', () => {
      cy.visit('/register');
      cy.title().should('include', 'Register');

      cy.get('input[name=name]').type(Cypress.env('name'));
      cy.get('input[name=email]').type(Cypress.env('email'));
      cy.get('input[name=password]').type(`${Cypress.env('wrongPassword')}`);
      cy
        .get('input[name=passwordRepeat]')
        .type(`${Cypress.env('wrongPassword')}{enter}`);

      cy
        .get('.message')
        .should('be.visible')
        .within($message => {
          expect($message).to.contain('Error');
          expect($message).to.contain(
            'Password must be at least 5 characters long and contain one number',
          );
        });

      cy.get('form').within($form => {
        expect($form.find('.help')).to.contain(
          'Password must be at least 5 characters long and contain one number',
        );
        expect($form.find('[name="name"]')).to.have.class('is-success');
        expect($form.find('[name="email"]')).to.have.class('is-success');
        expect($form.find('[name="password"]')).to.have.class('is-danger');
        expect($form.find('[name="passwordRepeat"]')).to.have.class('is-danger');
      });

      cy.get('nav').within(() => {
        cy.get('[href="/profile"]').should('not.be.visible');
        cy.get('.button').should('contain', 'Login');
      });
    });
  });
});
