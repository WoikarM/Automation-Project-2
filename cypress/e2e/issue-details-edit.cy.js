describe("Issue details editing", () => {
  const expectedLength = 5;
  let priorityOptions = [];

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Should validate values in issue priorities dropdown", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:priority"]')
        .invoke("text")
        .then((initialPriority) => {
          priorityOptions.push(initialPriority.trim());
        });

      cy.get('[data-testid="select:priority"]').click("bottomRight");

      cy.get('[data-testid^="select-option:"]').each(($option, index) => {
        const optionText = $option.find(".jpWath").text().trim();
        priorityOptions.push(optionText);
        cy.log(
          `Added value: ${optionText}. Length of the array: ${priorityOptions.length}`
        );
      });

      cy.wrap(priorityOptions).should("have.length", expectedLength);

      cy.get('[data-testid="select:priority"]').click("bottomRight");
    });
  });

  it("Should validate reporter's name has only characters", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]')
        .invoke("text")
        .then((reporterName) => {
          expect(reporterName.trim()).to.match(/^[A-Za-z\s]+$/);
        });
    });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
