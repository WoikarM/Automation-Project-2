describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it("Should add, edit, and delete a comment successfully", () => {
    const initialComment = "Initial comment";
    const editedComment = "Edited comment";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();
      cy.get('textarea[placeholder="Add a comment..."]').type(initialComment);
      cy.contains("button", "Save").click();
      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", initialComment);
    });

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]').first().contains("Edit").click();
      cy.get('textarea[placeholder="Add a comment..."]')
        .clear()
        .type(editedComment);
      cy.contains("button", "Save").click();
      cy.get('[data-testid="issue-comment"]').should("contain", editedComment);
    });

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Delete")
        .click();
    });
    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click();

    cy.get('[data-testid="modal:issue-details"]').should(
      "not.contain",
      '<div data-testid="issue-comment"'
    );
  });
});
