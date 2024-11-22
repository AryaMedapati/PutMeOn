describe('home functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login/')
    // cy.visit('http://localhost:5002/')
    // cy.visit('http://localhost:3000/')
    cy.wait(500)

    cy.get('#user').type('cypressTesting2@gmail.com')
    cy.get('#user').should('have.value', 'cypressTesting2@gmail.com')

    cy.get('#pass').type('Testing2')
    cy.get('#pass').should('have.value', 'Testing2')

    cy.get('#login').click()
    

  })

  it('Displays feed and friends activity', () => {
    cy.get('.track-list', {timeout: 15000}).should('be.visible');
  });

  it('Like button functionality', () => {  
    cy.get('.track-list', { timeout: 15000 })
      .children()
      .should('have.length.greaterThan', 0);
  
    cy.get('.track-activity').first().within(() => {
      cy.get('.like-button').first().should('be.visible').click();
      cy.get('.like-button').first().invoke('text').should('include', '1');
      cy.get('.like-button').first().click();
      cy.get('.like-button').first().invoke('text').should('include', '0');
    });
  });

  it('React buttons functionality', () => {  
    cy.get('.track-list', { timeout: 15000 })
      .children()
      .should('have.length.greaterThan', 0);
  
    cy.get('.track-activity').first().within(() => {
      cy.get('.laughing-button').first().should('be.visible').click();
      cy.get('.laughing-button').first().invoke('text').should('include', '1');
      cy.get('.laughing-button').first().click();
      cy.get('.laughing-button').first().invoke('text').should('include', '0');
      cy.get('.fire-button').first().should('be.visible').click();
      cy.get('.fire-button').first().invoke('text').should('include', '1');
      cy.get('.fire-button').first().click();
      cy.get('.fire-button').first().invoke('text').should('include', '0');
    });
  });
  it('Comment button functionality', () => {  
    cy.get('.track-list', { timeout: 15000 })
      .children()
      .should('have.length.greaterThan', 0);
  
    cy.get('.track-activity').first().within(() => {
      cy.get('.comment-section').first().should('be.visible');
      cy.get('.cmt-button').first().should('be.visible').click();
      cy.get('.input-comment').first().type("cypress test comment");
      cy.get('.submit-button').first().click();
      cy.get('.comment-text').last().invoke('text').should('include', 'cypress test comment');
    });
  });
  
})