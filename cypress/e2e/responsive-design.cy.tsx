describe('Design Responsivo', () => {
  const loginUrl = 'http://localhost:3000';
  const viewports = ['iphone-6', 'ipad-2', [1920, 1080]];

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  viewports.forEach((viewport) => {
    it(`deveria funcionar bem em ${Array.isArray(viewport) ? `${viewport[0]}x${viewport[1]}` : viewport}`, () => {
      if (typeof viewport === 'string') {
        cy.viewport(viewport as Cypress.ViewportPreset);
      } else {
        cy.viewport(viewport[0], viewport[1]);
      }

      cy.get('#header-layout').should('be.visible');
    });
  });
});
