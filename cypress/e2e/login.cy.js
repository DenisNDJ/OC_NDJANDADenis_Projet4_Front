describe('Login tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login')
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-1').clear();
  });

  it('Check missing and invalid input', () => {
    cy.get('#mat-input-0').type('notEmail');
    cy.get('#mat-input-0').should('have.class', 'ng-invalid');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('#mat-input-1').type('password');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('#mat-input-0').clear();
    cy.get('button[type=submit]').should('be.disabled');
  })

  it('Check error message invalid password', () => {
    cy.intercept(
      'POST',
      '/api/auth/login', 
      {
        statusCode: 401,
      }
    ).as('loginFailedRequest');

    cy.get('#mat-input-0').type('yoga@studio.com');
    cy.get('#mat-input-1').type('wrongPassmord');
    cy.get('button[type=submit]').click();
    cy.get('p.error').should('have.text', 'An error occurred');
    cy.get('p.error').should('be.visible');
  })

  it('Check error message invalid email', () => {
    cy.intercept(
      'POST',
      '/api/auth/login', 
      {
        statusCode: 401,
      }
    ).as('loginFailedRequest');

    cy.get('#mat-input-0').type('invalidEmail@studio.com');
    cy.get('#mat-input-1').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.get('p.error').should('have.text', 'An error occurred');
    cy.get('p.error').should('be.visible');
  })

  it('Check login ', () => {
    cy.intercept(
      'POST',
      '/api/auth/login',
      {
        body:{
        "id": 1,
        "username": "yoga@studio.com",
        "firstName": "Admin",
        "lastName": "Admin",
        "admin": true,
        "token": "token",
        "type": "Bearer"
        }
      },).as("loginRequest");

    cy.get('#mat-input-0').type('yoga@studio.com');
    cy.get('#mat-input-1').type('test!1234');
    cy.get('button[type=submit]').click();

    cy.location('pathname').should('include', 'sessions');



  })
})