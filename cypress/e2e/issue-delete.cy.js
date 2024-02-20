describe("Deleting an Issue & Canceling Issue Deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should delete the issue", () => {
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.contains("button", "Delete issue").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist", {
      timeout: 60000,
    });
    cy.contains("This is an issue of type: Task.").should("not.exist");
  });

  it("Should cancel the issue deletion process", () => {
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.contains("button", "Cancel").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist", {
      timeout: 60000,
    });
    cy.get('[data-testid="modal:issue-details"]')
      .get('[data-testid="icon:close"]')
      .first()
      .click();
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    cy.contains("This is an issue of type: Task.").should("exist");
  });
});
