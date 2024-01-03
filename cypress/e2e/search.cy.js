describe('template spec', () => {
  it('Verifies Search Results', () => {
    cy.visit('https://www.nepaccess.org/').then((args) => {
      cy.log(`cy.visit ~ args:`, args);
      cy.get('#landing-search-bar').type('copper mine {enter}');    
      cy.wait(5000)    
      cy.get('#tutorial-close').click();
      const results = cy.get('#results-label').invoke('text');
      cy.log('Results', results);

      cy.get('#results-label').should('contain', 'Copper Mine');

    });
  
  })
  it('Gets Search Result Details', () => {
    cy.visit('https://localhost:3000/record-details?id=17704');
    cy.wait(5000);
    cy.get('span.record-details-title').should('contain', 'I-35');

  })
});