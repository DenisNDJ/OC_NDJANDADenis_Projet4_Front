describe('Login tests', () => {

  beforeEach(() => {
    cy.intercept('GET','/api/session',{ fixture: 'sessions.json',},);

    cy.visit('http://localhost:4200/login')
    
    cy.get('[data-cy="emailInput_login"]').clear();
    cy.get('[data-cy="passwordInput_login"]').clear();
  });

  it('Check missing and invalid input', () => {
    cy.get('[data-cy="emailInput_login"]').type('notEmail');
    cy.get('[data-cy="emailInput_login"]').should('have.class', 'ng-invalid');
    cy.get('[data-cy="submitBtn_login"]').should('be.disabled');
    cy.get('[data-cy="passwordInput_login"]').type('password');
    cy.get('[data-cy="submitBtn_login"]').should('be.disabled');
    cy.get('[data-cy="emailInput_login"]').clear();
    cy.get('[data-cy="submitBtn_login"]').should('be.disabled');
  })

  it('Check error message invalid password', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 401, }).as('loginFailedRequest');

    cy.get('[data-cy="emailInput_login"]').type('yoga@studio.com');
    cy.get('[data-cy="passwordInput_login"]').type('wrongPassmord');
    cy.get('[data-cy="submitBtn_login"]').click();
    cy.get('p.error').should('have.text', 'An error occurred');
    cy.get('p.error').should('be.visible');
  })

  it('Check error message invalid email', () => {
    cy.intercept('POST', '/api/auth/login',{ statusCode: 401, }).as('loginFailedRequest');

    cy.get('[data-cy="emailInput_login"]').type('invalidEmail@studio.com');
    cy.get('[data-cy="passwordInput_login"]').type('test!1234');
    cy.get('[data-cy="submitBtn_login"]').click();
    cy.get('p.error').should('have.text', 'An error occurred');
    cy.get('p.error').should('be.visible');
  })

  it('Check login and logout', () => {
    cy.intercept('POST','/api/auth/login',{ fixture: 'userAdmin.json', },).as("loginRequest");

    cy.get('[data-cy="emailInput_login"]').type('yoga@studio.com');
    cy.get('[data-cy="passwordInput_login"]').type('test!1234');
    cy.get('[data-cy="submitBtn_login"]').click();

    cy.location('pathname').should('include', 'sessions');

    cy.get('[data-cy="logout_nav"]').click();

    cy.location('pathname').should('include', 'login');

  })
})