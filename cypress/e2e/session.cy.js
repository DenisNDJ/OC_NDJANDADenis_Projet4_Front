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
        },);

        cy.intercept(
        'POST',
        '/api/session',
        {
        body:{
            "name": "Yoga du temps perdu",
            "date": "2026-11-11",
            "teacher_id": 3,
            "users": null,
            "description": "Le yoga du temps perdu."
        }
        },);

        cy.intercept(
        'GET',
        '/api/session',
        {
            fixture: 'sessions.json',
        },);

        cy.intercept(
        'GET',
        '/api/teacher',
        {
            fixture: 'teachers.json',
        },);

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

        it('Check session creation', () => {
        cy.location('pathname').should('include', 'sessions');
        
        
        cy.get('[data-cy="session_create"]').click();
        
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.disabled');
        cy.get('[data-cy="name_sessionCr"]').type('Yoga du temps perdu');
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.disabled');
        cy.get('[data-cy="description_sessionCr"]').type('Le yoga du temps perdu.');
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.disabled');
        cy.get('[data-cy="date_sessionCr"]').type('2026-11-11');
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.disabled');
        cy.get('[data-cy="teacherLst_sessionCr"]').click();
        cy.get('[data-cy="teacher_sessionCr"]').last().click();
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.not.disabled');
        cy.get('[data-cy="btnCreate_sessionCr"]').click();
        cy.get('#mat-snack-bar-container-live-0 div.mat-mdc-snack-bar-label').should('be.visible');
        })
})