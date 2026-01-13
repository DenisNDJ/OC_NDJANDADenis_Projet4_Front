describe('Not found test', () => {

  it('Check the not found page', () => {
    cy.visit('http://localhost:4200/wrong')

    cy.get('[data-cy="notFoundMessage"]').should('contain', 'Page not found !');

    cy.get('[data-cy="login_nav"]').should('be.visible');
    cy.get('[data-cy="register_nav"]').should('be.visible');

    cy.location('pathname').should('include', '404');
  })

})