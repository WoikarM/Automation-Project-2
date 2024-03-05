describe("Time Estimation and Logging Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
    cy.visit("/board");
    cy.contains("This is an issue of type: Task.").click();
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  const convertToMinutes = (timeString) => {
    const hoursMatch = timeString.match(/(\d+)h/);
    const minutesMatch = timeString.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    return hours * 60 + minutes;
  };

  const openTimeTrackingModal = () => {
    cy.get('[data-testid="icon:stopwatch"]').first().click(); // Open the "Time Tracking" modal
  };

  const getTimeSpentInput = () =>
    cy.contains("Time spent (hours)").next("div").find("input");

  const clickDoneButton = () => {
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.contains("button", "Done").should("be.visible").click();
    });
  };

  const logTime = (time) => {
    openTimeTrackingModal();
    cy.log("Logging time spent:", time); // Logging statement
    getTimeSpentInput()
      .clear({ force: true })
      .type(convertToMinutes(time).toString());
    clickDoneButton();
    openTimeTrackingModal(); // Reopen the modal after logging time
  };

  const updateRemainingTime = (time) => {
    cy.contains("Time remaining (hours)")
      .next("div")
      .find("input")
      .then(($input) => {
        if ($input.length > 0) {
          cy.log("Updating remaining time:", time); // Logging statement
          if ($input[0].tagName === "INPUT") {
            cy.wrap($input)
              .clear({ force: true })
              .type(convertToMinutes(time).toString());
          } else {
            // Retry if the input field is not an input element
            updateRemainingTime(time);
          }
        } else {
          // Retry if the input field is not found
          updateRemainingTime(time);
        }
      });
  };

  const setEstimation = (estimation) => {
    getIssueDetailsModal().within(() => {
      cy.contains("Original Estimate (hours)").click();
      cy.get('input[placeholder="Number"]')
        .clear()
        .type(convertToMinutes(estimation).toString());
    });
  };

  const clearEstimation = () => {
    getIssueDetailsModal().within(() => {
      cy.contains("Original Estimate (hours)").click();
      cy.get('input[placeholder="Number"]').clear({ force: true });
    });
  };

  it("Should add, edit, and remove time estimation successfully", () => {
    const initialEstimation = "1h 30m";
    const updatedEstimation = "2h";

    setEstimation(initialEstimation);
    cy.get('input[placeholder="Number"]').should(
      "have.value",
      convertToMinutes(initialEstimation)
    );

    setEstimation(updatedEstimation);
    cy.get('input[placeholder="Number"]').should(
      "have.value",
      convertToMinutes(updatedEstimation)
    );

    clearEstimation();
    cy.get('input[placeholder="Number"]').should("not.have.value");
  });

  it.only("Should log time spent and update time remaining successfully", () => {
    const timeLogged = "1h";
    // Directly update time remaining in the DOM
    cy.contains("Time remaining (hours)")
      .next("div")
      .find("input")
      .then(($input) => {
        if ($input.length > 0) {
          cy.log("Updating remaining time:", timeLogged); // Logging statement
          if ($input[0].tagName === "INPUT") {
            cy.wrap($input)
              .clear({ force: true })
              .type(convertToMinutes(timeLogged).toString());
            clickDoneButton();
          } else {
            // Retry if the input field is not an input element
            updateRemainingTime(timeLogged);
          }
        } else {
          // Retry if the input field is not found
          updateRemainingTime(timeLogged);
        }
      });

    // Log time spent
    logTime(timeLogged);
    getTimeSpentInput().should("have.value", convertToMinutes(timeLogged));

    // Ensure the modal is closed before proceeding
    cy.get('[data-testid="modal:tracking"]').should("not.exist");
  });
});
