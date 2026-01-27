describe('Register tests', () => {

    beforeEach(() => {
        cy.visit('http://localhost:4200/register')
    });

    it('Check missing or wrong input', () => {
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('[data-cy="firstName_register"]').type('denis');
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('[data-cy="lastName_register"]').type('ndjanda');
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('[data-cy="email_register"]').type('notEmail');
        cy.get('[data-cy="email_register"]').should('have.class', 'ng-invalid');
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('[data-cy="password_register"]').type('password');
        cy.get('button[type=submit]').should('be.disabled');
    })

    it('Regiter', () => {
        cy.intercept(
        'POST',
        '/api/auth/register', 
        {
            statusCode: 200,
            body:{
            "message": "User registered successfully!"
            },
        }
        ).as('loginFailedRequest');

        cy.get('[data-cy="firstName_register"]').type('denis');
        cy.get('[data-cy="lastName_register"]').type('ndjanda');
        cy.get('[data-cy="email_register"]').type('denis@gmail.com');
        cy.get('[data-cy="password_register"]').type('password');
        cy.get('button[type=submit]').click();
        cy.location('pathname').should('include', 'login');
    })

    it('Fail to Regiter', () => {
        cy.intercept(
        'POST',
        '/api/auth/register', 
        {
            statusCode: 401,
            body:{
            "message": "Error: Email is already taken!"
            },
        }
        ).as('loginFailedRequest');
        
        cy.get('[data-cy="firstName_register"]').type('denis');
        cy.get('[data-cy="lastName_register"]').type('ndjanda');
        cy.get('[data-cy="email_register"]').type('denis@gmail.com');
        cy.get('[data-cy="password_register"]').type('password');
        cy.get('button[type=submit]').click();
        cy.get('span.error').should('be.visible');
        cy.get('span.error').should('have.text', 'An error occurred');
    })
})