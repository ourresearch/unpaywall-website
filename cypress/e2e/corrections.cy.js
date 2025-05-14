// Placeholder Cypress tests for Corrections.vue

describe('Corrections Page', () => {

  beforeEach(() => {
    cy.intercept('POST', '**/corrections', { statusCode: 200, body: { success: true } }).as('submitCorrection');
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
    cy.contains("Fix a Journal").click()
    cy.get("input").first().type("2693-8499");
    cy.contains("Submit").click();
    cy.contains("Cardiology Discovery").should("be.visible");
    cy.contains("Unpaywall thinks this journal is open access").should("be.visible");
  });

  it('shows error for invalid DOI', () => {
    cy.visit('/fix');
    cy.get("input").first().type("error");
    cy.contains("Submit").click();
    cy.contains("not found").should("be.visible");
  });


  it('reports a Gold DOI as Closed', () => {
    cy.viewport(1400, 900);
    cy.visit('/fix?admin=1');
    cy.contains("Gold DOI").click();
    cy.contains("Forced Convection Heat Transfer to Boiling Helium").should("be.visible");
    cy.contains("Unpaywall thinks this work is free to read at the publisher").should("be.visible");
    cy.contains("paywalled").click();
    cy.contains("Optionally add your email in case we need to follow up:").should("be.visible");
    cy.get("input").type("test@example.com");
    cy.contains("button", "Submit").click();

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

  it('reports a Closed DOI as Open', () => {
    cy.viewport(1400, 900);
    cy.visit('/fix?admin=1');
    cy.contains("Closed DOI").click();
    cy.contains("PV metal roofing module").should("be.visible");
    cy.contains("Unpaywall thinks this work is paywalled").should("be.visible");
    cy.contains("free to read").click();
    cy.contains("Add Open Access Link").should("be.visible");
    cy.get("input").first().type("https://example.com");
    cy.contains("Save").click();
    cy.contains("Optionally add your email in case we need to follow up:").should("be.visible");
    cy.get("input").first().type("test@example.com");
    cy.contains("button", "Submit").click();

    cy.wait('@submitCorrection').then((interception) => {
      const post = interception.request.body;
      expect(post).to.deep.equal({
        type: 'doi',
        id: '10.1109/pvsc.1996.564405',
        email: 'test@example.com',
        'New url': "https://example.com",
        'New host_type': "publisher",
        'Previous url': null,
        'Previous host_type': null,
      });
    });

    cy.contains("Your correction has been received").should("be.visible");
  });


});
