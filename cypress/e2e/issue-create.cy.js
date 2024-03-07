import faker from "faker";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");
      cy.get('input[name="title"]').type("TEST_TITLE");
      cy.get('input[name="title"]').should("have.value", "TEST_TITLE");
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
            cy.get('[data-testid="icon:story"]').should("be.visible");
          });
      });
    cy.get('[data-testid="board-list:backlog"]')
      .contains("TEST_TITLE")
      .within(() => {
        cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
        cy.get('[data-testid="icon:story"]').should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });

  it("Should create a bug issue with specific details and validate its visibility", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type("My bug description");
      cy.get(".ql-editor").should("have.text", "My bug description");
      cy.get('input[name="title"]').type("Bug");
      cy.get('input[name="title"]').should("have.value", "Bug");
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').click();
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();
      cy.contains("Reporter").next().click();
      cy.contains("Pickle Rick").click();
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
        cy.get('[data-testid="icon:bug"]').should("be.visible");
      });
  });

  it("Should create a new issue using the random data plugin", () => {
    const randomTitle = faker.random.word();
    const randomDescription = faker.lorem.words();
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type(randomDescription);
      cy.get(".ql-editor").should("have.text", randomDescription);
      cy.get('input[name="title"]').type(randomTitle);
      cy.get('input[name="title"]').should("have.value", randomTitle);
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();
      cy.contains("Reporter").next().click();
      cy.contains("Baby Yoda").click();
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.contains(randomTitle).should("be.visible");
      });
  });

  it("Should remove unnecessary spaces on the board view", () => {
    const title = "   Hello    world!   ";

    cy.get('[data-testid="modal:issue-create"]').should("be.visible");
    cy.get('input[name="title"]').type(title);

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').click();
      cy.get('button[type="submit"]').click();
    });

    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.get('[data-testid="list-issue"]')
      .first()
      .find("p")
      .then(($titleElement) => {
        const actualTitle = $titleElement.text().trim();
        const expectedTitle = title.trim();
        expect(actualTitle).to.equal(expectedTitle);
      });
  });
});
