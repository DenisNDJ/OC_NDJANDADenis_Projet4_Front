describe('Register tests', () => {

    beforeEach(() => {
        cy.visit('http://localhost:4200/register')
    });

    it('Check missing or wrong input', () => {
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('#mat-input-0').type('denis');
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('#mat-input-1').type('ndjanda');
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('#mat-input-2').type('notEmail');
        cy.get('#mat-input-2').should('have.class', 'ng-invalid');
        cy.get('button[type=submit]').should('be.disabled');
        cy.get('#mat-input-3').type('password');
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

        cy.get('#mat-input-0').type('denis');
        cy.get('#mat-input-1').type('ndjanda');
        cy.get('#mat-input-2').type('denis@gmail.com');
        cy.get('#mat-input-3').type('password');
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
        
        cy.get('#mat-input-0').type('denis');
        cy.get('#mat-input-1').type('ndjanda');
        cy.get('#mat-input-2').type('denis@gmail.com');
        cy.get('#mat-input-3').type('password');
        cy.get('button[type=submit]').click();
        cy.get('span.error').should('be.visible');
        cy.get('span.error').should('have.text', 'An error occurred');
    })
})