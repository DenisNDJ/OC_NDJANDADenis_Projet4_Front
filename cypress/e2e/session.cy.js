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
        'PUT',
        '/api/session/1',
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

        cy.intercept(
        'GET',
        '/api/teacher/1',
        {
            fixture: 'teacher1.json',
        },);

        cy.intercept(
        'GET',
        '/api/session/1',
        {
            fixture: 'session1.json',
        },);

        cy.intercept(
        'DELETE',
        '/api/session/1',
        {},);

        cy.visit('http://localhost:4200/login');
        cy.get('[data-cy="emailInput_login"]').type('yoga@studio.com');
        cy.get('[data-cy="passwordInput_login"]').type('test!1234');
        cy.get('[data-cy="submitBtn_login"]').click();
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

    it('Check session creation and the form with missing field', () => {
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
        cy.get('#mat-snack-bar-container-live-0 div.mat-mdc-snack-bar-label').should('have.text', ' Session created !\n');
    })

    it('Check session information', () => {
        cy.location('pathname').should('include', 'sessions');
        
        cy.get('[data-cy="session_detailBtn"]').first().click();
        
        cy.fixture('session1.json').then((session)=>{
            cy.get('[data-cy="sessionName_detail"]').should('contain',session.name);
            cy.get('[data-cy="sessionNbrParticipant_detail"]').should('contain',session.users.length);
            cy.get('[data-cy="sessionDescription_detail"]').should('contain',session.description);
            cy.get('[data-cy="sessionDate_detail"]').should('contain',new Date(Date.parse(session.date)).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}));
            cy.get('[data-cy="sessionCreatedAt_detail"]').should('contain',new Date(Date.parse(session.createdAt)).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}));
            cy.get('[data-cy="sessionUpdatedAt_detail"]').should('contain',new Date(Date.parse(session.updatedAt)).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}));
            cy.fixture('teacher1.json').then((teacher)=>{
                cy.get('[data-cy="sessionTeacher_detail"]').should('contain',teacher.firstName);
                cy.get('[data-cy="sessionTeacher_detail"]').should('contain',teacher.lastName);
            });
            
        })
        cy.get('[data-cy="sessionDeleteBtn_detail"]').should('be.visible');
    })

    it('Check delete session', () => {
        cy.location('pathname').should('include', 'sessions');
        
        cy.get('[data-cy="session_detailBtn"]').first().click();
        
        cy.get('[data-cy="sessionDeleteBtn_detail"]').should('be.visible');
        
        cy.get('[data-cy="sessionDeleteBtn_detail"]').click();
        
        cy.get('div.mat-mdc-snack-bar-label').should('be.visible');
        cy.get('#mat-snack-bar-container-live-0 div.mat-mdc-snack-bar-label').should('have.text', ' Session deleted !\n');
        cy.location('pathname').should('include', 'sessions');
    })

    it('Modify session information and check missing input', () => {
        cy.location('pathname').should('include', 'sessions');
        
        cy.get('[data-cy="session_edit"]').first().click();
        
        cy.get('[data-cy="name_sessionCr"]').clear();
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.disabled');
        cy.get('[data-cy="name_sessionCr"]').type('Yoga du temps perdu');
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.not.disabled');
        
        
        cy.get('[data-cy="date_sessionCr"]').clear();
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.disabled');
        cy.get('[data-cy="date_sessionCr"]').type('2026-11-11');
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.not.disabled');
        
        cy.get('[data-cy="description_sessionCr"]').clear();
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.disabled');
        cy.get('[data-cy="description_sessionCr"]').type('Le yoga du temps perdu.');
        cy.get('[data-cy="btnCreate_sessionCr"]').should('be.not.disabled');
        
        
        cy.get('[data-cy="btnCreate_sessionCr"]').click();
        
        
        cy.get('div.mat-mdc-snack-bar-label').should('be.visible');
        cy.get('#mat-snack-bar-container-live-0 div.mat-mdc-snack-bar-label').should('have.text', ' Session updated !\n');
        cy.location('pathname').should('include', 'sessions');
    })
})