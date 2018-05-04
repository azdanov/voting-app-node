describe('/profile', () => {
  before(() => {
    cy.exec('npm run db:seed');
  });

  after(() => {
    cy.exec('npm run db:reset');
  });

  beforeEach('should have correct update form', () => {
    cy.visit('/login');

    cy.get('input[name="_csrf"]').then($input => {
      const loginCsrfToken = $input.attr('value');
      cy
        .request('POST', '/login', {
          email: Cypress.env('email'),
          password: Cypress.env('password'),
          _csrf: loginCsrfToken,
        })
        .then(() => {
          cy.visit('/profile');
        });
    });
  });

  it('should contain correct profile form', () => {
    cy.title().should('include', 'Profile');
    cy.get('main form').within(() => {
      cy.get('input').should('have.length', 7);
      cy.get('input[name="email"]').should('have.attr', 'disabled');
      cy.get('input:first').should($input => {
        expect($input.attr('name')).to.equal('_csrf');
        expect($input.val()).not.to.eq('');
      });
    });
  });

  it('should change name on profile update', () => {
    cy.get('input[name="name"]').type(' new{enter}');

    cy.get('input[name="name"]').should('have.value', `${Cypress.env('name')} new`);
    cy.get('.message').should('contain', 'Name successfully changed');
  });

  it('should not change name on profile update with incorrect input', () => {
    cy.get('input[name="name"]').type(' new@{enter}');

    cy.get('input[name="name"]').should('be.empty');
    cy
      .get('.message')
      .should(
        'contain',
        'Please enter only unaccented alphabetical letters, A–Z or a–z',
      );
  });

  describe('/profile/password', () => {
    const newPassword = `${Cypress.env('password')}new`;

    it('should change password on new password profile update', () => {
      cy.visit('/profile/password');

      cy.get('input[name="passwordOld"]').type(Cypress.env('password'));
      cy.get('input[name="passwordNew"]').type(newPassword);
      cy.get('input[name="passwordRepeat"]').type(`${newPassword}{enter}`);
      cy.get('.message').should('contain', 'Password successfully changed');

      cy
        .contains('Logout')
        .siblings('[name="_csrf"]')
        .then($input => {
          const logoutCsrfToken = $input.attr('value');

          cy.request('POST', '/logout', { _csrf: logoutCsrfToken }).then(() => {
            cy.visit('/login');

            cy.get('input[name="_csrf"]').then($input => {
              const loginCsrfToken = $input.attr('value');
              cy
                .request('POST', '/login', {
                  email: Cypress.env('email'),
                  password: newPassword,
                  _csrf: loginCsrfToken,
                })
                .then(() => {
                  cy.visit('/');
                  cy.contains('Logout');

                  cy.exec('npm run db:reset');
                  cy.exec('npm run db:seed');
                });
            });
          });
        });
    });

    it('should not change password on with incorrect old password', () => {
      cy.visit('/profile/password');

      cy.get('input[name="passwordOld"]').type('Nope123');
      cy.get('input[name="passwordNew"]').type(Cypress.env('password'));
      cy.get('input[name="passwordRepeat"]').type(`${Cypress.env('password')}{enter}`);

      cy.get('.message').should('contain', 'Entered old password is incorrect');
    });

    it('should not change password on with incorrect new password', () => {
      cy.visit('/profile/password');

      cy.get('input[name="passwordOld"]').type(Cypress.env('password'));
      cy.get('input[name="passwordNew"]').type('nope');
      cy.get('input[name="passwordRepeat"]').type('nope{enter}');

      cy
        .get('.message')
        .should(
          'contain',
          'Password must be at least 5 characters long and contain one number',
        );
    });

    it('should not change password on with incorrect repeat password', () => {
      cy.visit('/profile/password');

      cy.get('input[name="passwordOld"]').type(Cypress.env('password'));
      cy.get('input[name="passwordNew"]').type('nope123');
      cy.get('input[name="passwordRepeat"]').type('nope12{enter}');

      cy.get('.message').should('contain', 'Passwords do not match');
    });
  });

  describe('/profile/delete', () => {
    it('should delete the user', () => {
      cy.get('input[name="delete"]').click();
      cy.get('.message').should('contain', 'Your account has been deleted');
      cy.url().should('contain', '/');

      cy.visit('/login');

      cy.get('input[name="_csrf"]').then($input => {
        const csrfToken = $input.attr('value');
        cy
          .request('POST', '/login', {
            email: Cypress.env('email'),
            password: Cypress.env('password'),
            _csrf: csrfToken,
          })
          .then(() => {
            cy.visit('/profile');
            cy.get('.message').should('contain', 'You must be logged in to do that');
          });
      });
    });
  });
});
