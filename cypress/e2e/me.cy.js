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
        },).as("sessionsRequest");

        cy.intercept(
        'GET',
        '/api/user/1',
        {
            fixture: 'user.json',
        },).as("userRequest");

        cy.visit('http://localhost:4200/login');
        cy.get('#mat-input-0').type('yoga@studio.com');
        cy.get('#mat-input-1').type('test!1234');
        cy.get('button[type=submit]').click();
    });

    it('Check the account info', () => {
        cy.location('pathname').should('include', 'sessions');
        
        cy.get('[data-cy="account_nav"]').click();

        cy.fixture('user.json').then((user)=>{
            cy.get('[data-cy="name_me"]').should('contain',user.firstName);
            cy.get('[data-cy="name_me"]').should('contain',user.lastName);
            cy.get('[data-cy="email_me"]').should('contain',user.email);
            cy.get('[data-cy="admin_me"]').should('be.visible');
            cy.get('[data-cy="createdAt_me"]').should('contain',new Date(Date.parse(user.createdAt)).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}));
            cy.get('[data-cy="updateAt_me"]').should('contain',new Date(Date.parse(user.updatedAt)).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}));
        })
    })

    it('Check the delete button', () => {
        cy.location('pathname').should('include', 'sessions');
        
        cy.get('[data-cy="account_nav"]').click();
        
        cy.get('[data-cy="deleteBtn_me"]').should('be.visible');

    })
})