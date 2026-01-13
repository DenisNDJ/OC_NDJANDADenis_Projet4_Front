describe('Users tests', () => {

  beforeEach(() => {
        cy.intercept(
        'GET',
        '/api/session',
        {
            fixture: 'sessions.json',
        },);


        cy.intercept(
        'POST',
        '/api/auth/login',
        {
            fixture: 'user.json',
        },).as("loginRequest");

        cy.intercept(
        'GET',
        '/api/session/1',
        {
            fixture: 'session1.json',
        },);

        cy.intercept(
        'GET',
        '/api/session/8',
        {
            fixture: 'session8.json',
        },);

        cy.intercept(
        'GET',
        '/api/teacher/1',
        {
            fixture: 'teacher1.json',
        },);

        cy.intercept(
        'GET',
        '/api/teacher/2',
        {
            fixture: 'teacher1.json',
        },);

        cy.visit('http://localhost:4200/login')
        cy.get('#mat-input-0').clear();
        cy.get('#mat-input-1').clear();
  });

  it('Check login and participate button', () => {
    cy.get('#mat-input-0').type('denis@studio.com');
    cy.get('#mat-input-1').type('test!1234');
    cy.get('button[type=submit]').click();

    cy.location('pathname').should('include', 'sessions');
    cy.get('[data-cy="session_detailBtn"]').first().click();
    cy.get('[data-cy="sessionParticipateBtn_detail"]').should('be.visible');
  })

    it('Check login and unparticipate button', () => {
    cy.get('#mat-input-0').type('denis@studio.com');
    cy.get('#mat-input-1').type('test!1234');
    cy.get('button[type=submit]').click();

    cy.location('pathname').should('include', 'sessions');
    cy.get('[data-cy="session_detailBtn"]').eq(1).click();
    cy.get('[data-cy="sessionUnparticipateBtn_detail"]').should('be.visible');
  })

})