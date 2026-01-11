describe('Sessions tests', () => {
    beforeEach(() => {
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

        cy.intercept(
        'GET',
        '/api/session',
        {
            fixture: 'sessions.json',
        },).as("sessions");

        cy.visit('http://localhost:4200/login');
        cy.get('#mat-input-0').type('yoga@studio.com');
        cy.get('#mat-input-1').type('test!1234');
        cy.get('button[type=submit]').click();
    });

    it('Check the number of sessions', () => {
        cy.location('pathname').should('include', 'sessions');
        
        cy.fixture('sessions.json').then((session)=>{
            cy.get("[data-cy='lst_sessions']").should('have.length', session.length);
        });
    })

    it('Check the create session button', () => {
        cy.location('pathname').should('include', 'sessions');

        cy.get('[data-cy="session_create"]').should('be.visible');
    })

    it('Check the edit session button', () => {
        cy.location('pathname').should('include', 'sessions');

        cy.get('[data-cy="session_edit"]').each(($el)=>{
             cy.wrap($el).should('be.visible');
        });
    })
})