describe("Deleting an Issue & Canceling Issue Deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
      });
  });

  it("Should delete the issue", () => {
    let selectedIssueTitle;

    // Wait for the page to fully load
    cy.get('[data-testid="list-issue"]').should("exist", { timeout: 60000 });

    // Get the title of the first issue in the list and store it in selectedIssueTitle
    cy.get('[data-testid="list-issue"]')
      .first()
      .invoke("text")
      .then((text) => {
        selectedIssueTitle = text.trim();
      });

    // Click on the first issue
    cy.get('[data-testid="list-issue"]').first().click();

    // Assert the visibility of the issue detail view modal
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    // Click the Delete Issue button
    cy.get('[data-testid="icon:trash"]').click();

    // Confirm the deletion by clicking the confirm delete button
    cy.contains("button", "Delete issue").click();

    // Assert that the deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist", {
      timeout: 60000,
    });

    // Assert that the issue is deleted and no longer displayed on the Jira board
    cy.get('[data-testid="list-issue"]').should(
      "not.contain",
      selectedIssueTitle
    );
  });

  it("Should cancel the issue deletion process", () => {
    let selectedIssueTitle;

    // Wait for the page to fully load
    cy.get('[data-testid="list-issue"]').should("exist", { timeout: 60000 });

    // Get the title of the first issue in the list and store it in selectedIssueTitle
    cy.get('[data-testid="list-issue"]')
      .first()
      .invoke("text")
      .then((text) => {
        selectedIssueTitle = text.trim();
      });

    // Click on the first issue
    cy.get('[data-testid="list-issue"]').first().click();
    // Assert the visibility of the issue detail view modal
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    // Click the Delete Issue button
    cy.get('[data-testid="icon:trash"]').click();

    // Cancel the deletion in the confirmation pop-up
    cy.contains("button", "Cancel").click();

    // Assert that the deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist", {
      timeout: 60000,
    });

    // Assert that the issue is not deleted and is still displayed on the Jira board
    cy.get('[data-testid="list-issue"]').should(($issues) => {
      expect($issues).to.contain(selectedIssueTitle);
    });
  });
});
