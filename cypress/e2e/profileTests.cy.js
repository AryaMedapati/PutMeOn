describe('profile functinality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5002/')
  })

  it('passes', () => {
    cy.get('#user').type('cypressTesting@gmail.com')
    cy.get('#user').should('have.value', 'cypressTesting@gmail.com')

    cy.get('#pass').type('Testing1')
    cy.get('#pass').should('have.value', 'Testing1')

    cy.get('button[type="submit"]').click()

  })
})