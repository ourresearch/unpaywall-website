// Placeholder Cypress tests for Corrections.vue

describe('Corrections Page', () => {

  beforeEach(() => {
    cy.intercept('POST', '**/corrections', { statusCode: 200, body: { success: true } }).as('submitCorrection');
  });

  it('reports a Gold DOI as Closed', () => {
    cy.viewport(1400, 900);
    cy.visit('/fix');
    cy.contains("Gold DOI").click();
    cy.contains("Forced Convection Heat Transfer to Boiling Helium").should("be.visible");
    cy.contains("Unpaywall thinks this work is free to read at the publisher").should("be.visible");
    cy.contains("paywalled").click();
    cy.contains("Optionally add your email in case we need to follow up:").should("be.visible");
    cy.get("input").type("test@example.com");
    cy.contains("Submit").click();

    cy.wait('@submitCorrection').then((interception) => {
      const post = interception.request.body;
      expect(post).to.deep.equal({
        type: 'doi',
        id: '10.2221/jcsj.9.70',
        email: 'test@example.com',
        'New url': null,
        'New host_type': null,
        'Previous url': 'https://www.jstage.jst.go.jp/article/jcsj1966/9/2/9_2_70/_pdf',
        'Previous host_type': 'publisher',
      });
    });

    cy.contains("Your correction has been received").should("be.visible");
  });

  it('gets a DOI', () => {
    cy.visit('/fix');
    cy.get("input").first().type("10.2221/jcsj.9.70");
    cy.contains("Submit").click();
    cy.contains("Forced Convection Heat Transfer to Boiling Helium").should("be.visible");
    cy.contains("Unpaywall thinks this work is free to read at the publisher").should("be.visible");
  });

  it('gets an ISSN', () => {
    cy.visit('/fix');
    cy.get("input").eq(1).type("2693-8499");
    cy.get('button:contains("Submit")').eq(1).click();
    cy.contains("Cardiology Discovery").should("be.visible");
    cy.contains("Unpaywall thinks this journal is open access").should("be.visible");
  });


});
