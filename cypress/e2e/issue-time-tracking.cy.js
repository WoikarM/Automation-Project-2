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
    // Adding time estimation
    const initialEstimation = "8"; // Initial estimation value

    // Simulate entering initial estimation
    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .clear()
      .type(initialEstimation);

    // Asserting that the estimation is added and visible
    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .should("have.value", initialEstimation);

    // Editing the time estimation
    const updatedEstimation = "10"; // Updated estimation value
    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .clear()
      .type(updatedEstimation);

    // Asserting that the updated value is visible
    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .should("have.value", updatedEstimation);

    // Removing the time estimation
    cy.contains("Original Estimate (hours)").next("div").find("input").clear();

    // Asserting that the value is removed
    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .should("have.value", "");
  });

  it.only("Should add, edit, remove time spent and remaining", () => {
    // Open the issue details modal
    getIssueDetailsModal().should("exist");

    // Click the time tracking icon to access the time tracking modal
    cy.get('[data-testid="icon:stopwatch"]').click();

    // Clear existing data in the "Time spent (hours)" and "Time remaining (hours)" fields
    cy.contains("Time spent (hours)").next().find("input").clear();
    cy.contains("Time remaining (hours)").next().find("input").clear();

    // Get the value of "Original Estimate (hours)"
    cy.contains("Original Estimate (hours)")
      .next("div")
      .find("input")
      .invoke("val")
      .then((originalEstimate) => {
        // Enter the same value into "Time spent (hours)"
        cy.contains("Time spent (hours)").next().find("input").type("1"); // Simulate spending 1 hour

        // Calculate the remaining time
        const remainingTime = parseInt(originalEstimate) - 1;

        // Enter the remaining time into "Time remaining (hours)"
        cy.contains("Time remaining (hours)")
          .next("div")
          .find("input")
          .type(remainingTime.toString());

        // Assert that the "Time remaining (hours)" field contains the expected value
        cy.contains("Time remaining (hours)")
          .next("div")
          .find("input")
          .should("have.value", remainingTime.toString());
      });

    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.contains("Done").click();
    });

    // Assert that the Time tracking modal is no longer visible
    cy.get('[data-testid="modal:time-tracking"]').should("not.exist");

    // Open the issue details modal again
    getIssueDetailsModal().should("exist");

    // Click the time tracking icon to access the time tracking modal
    cy.get('[data-testid="icon:stopwatch"]').click();

    // Get the original estimate
    cy.contains("Original Estimate (hours)")
      .next()
      .find("input")
      .should("exist")
      .invoke("val")
      .then((originalEstimate) => {
        // Clear existing data in the "Time spent (hours)" field
        cy.contains("Time spent (hours)").next().find("input").clear();

        // Edit time spent to simulate spending 2 hours
        cy.contains("Time spent (hours)").next().find("input").type("2");

        // Calculate expected remaining time
        const originalEstimateValue = parseInt(originalEstimate);
        const timeSpent = 2;
        const expectedRemainingTime = originalEstimateValue - timeSpent;

        // Enter the remaining time into "Time remaining (hours)"
        cy.contains("Time remaining (hours)")
          .next()
          .find("input")
          .clear()
          .type(expectedRemainingTime.toString());

        // Click the "Done" button inside the "Time tracking" modal
        cy.get('[data-testid="modal:tracking"]').within(() => {
          cy.contains("Done").click();
        });

        // Assert that the Time tracking modal is no longer visible
        cy.get('[data-testid="modal:tracking"]').should("not.exist");

        // Open the issue details modal again
        getIssueDetailsModal().should("exist");

        // Click the time tracking icon to access the time tracking modal
        cy.get('[data-testid="icon:stopwatch"]').click();

        // Remove time remaining
        cy.contains("Time remaining (hours)").next().find("input").clear();

        // Clear time spent
        cy.contains("Time spent (hours)").next().find("input").clear();

        // Click the "Done" button inside the "Time tracking" modal
        cy.get('[data-testid="modal:tracking"]').within(() => {
          cy.contains("Done").click();
        });

        // Assert that the Time tracking modal is no longer visible
        cy.get('[data-testid="modal:tracking"]').should("not.exist");
      });
  });
});
