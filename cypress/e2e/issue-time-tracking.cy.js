describe("Time Estimation and Logging Functionality", () => {
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

  it("Should add, edit, and remove time estimation", () => {
    const initialEstimation = "8";

    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .clear()
      .type(initialEstimation);

    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .should("have.value", initialEstimation);

    const updatedEstimation = "10";
    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .clear()
      .type(updatedEstimation);

    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .should("have.value", updatedEstimation);

    cy.contains("Original Estimate (hours)").next("div").find("input").clear();

    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .should("have.value", "");
  });

  it("Should add, edit, remove time spent and remaining", () => {
    getIssueDetailsModal().should("exist");

    cy.get('[data-testid="icon:stopwatch"]').click();

    cy.contains("Time spent (hours)").next().find("input").clear();
    cy.contains("Time remaining (hours)").next().find("input").clear();

    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .invoke("val")
      .then((originalEstimate) => {
        cy.contains("Time spent (hours)").next().find("input").type("1");

        const remainingTime = parseInt(originalEstimate) - 1;

        cy.contains("Time remaining (hours)")
          .next("div")
          .find("input")
          .type(remainingTime.toString());

        cy.contains("Time remaining (hours)")
          .next("div")
          .find("input")
          .should("have.value", remainingTime.toString());
      });

    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.contains("Done").click();
    });

    cy.get('[data-testid="modal:time-tracking"]').should("not.exist");

    getIssueDetailsModal().should("exist");

    cy.get('[data-testid="icon:stopwatch"]').click();

    cy.contains("Original Estimate (hours)")
      .next()
      .find("input")
      .should("exist")
      .invoke("val")
      .then((originalEstimate) => {
        cy.contains("Time spent (hours)").next().find("input").clear();

        cy.contains("Time spent (hours)").next().find("input").type("2");

        const originalEstimateValue = parseInt(originalEstimate);
        const timeSpent = 2;
        const expectedRemainingTime = originalEstimateValue - timeSpent;

        cy.contains("Time remaining (hours)")
          .next()
          .find("input")
          .clear()
          .type(expectedRemainingTime.toString());

        cy.get('[data-testid="modal:tracking"]').within(() => {
          cy.contains("Done").click();
        });

        cy.get('[data-testid="modal:tracking"]').should("not.exist");

        getIssueDetailsModal().should("exist");

        cy.get('[data-testid="icon:stopwatch"]').click();

        cy.contains("Time remaining (hours)").next().find("input").clear();

        cy.contains("Time spent (hours)").next().find("input").clear();

        cy.get('[data-testid="modal:tracking"]').within(() => {
          cy.contains("Done").click();
        });

        cy.get('[data-testid="modal:tracking"]').should("not.exist");
      });
  });
});
