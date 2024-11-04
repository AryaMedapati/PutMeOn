describe("Friend Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login/");
    // cy.visit('http://localhost:5002/')
    // cy.visit('http://localhost:3000/')
    cy.wait(500);

    cy.get("#user").type("cypressTesting@gmail.com");
    cy.get("#user").should("have.value", "cypressTesting@gmail.com");

    cy.get("#pass").type("Testing1");
    cy.get("#pass").should("have.value", "Testing1");

    cy.get("#login").click();
    cy.wait(2000);

    cy.get("#profilePage").click();
  });

  it("Add Friend Test", () => {
    cy.get(".sidebarButton").eq(4).click();
    cy.contains("Friends").should("be.visible");

    cy.get(".bp5-input-group").type("cypressTesting2");
    cy.wait(3000);

    cy.get(".bp5-card.bp5-elevation-0").contains("Add Friend").click();
    cy.wait(3000);

    cy.get(".sidebarButton").eq(0).click();

    cy.contains("Log Out").click();

    // Logging in with user 2 to accept friend request

    cy.get("#user").type("cypressTesting2@gmail.com");
    cy.get("#user").should("have.value", "cypressTesting2@gmail.com");

    cy.get("#pass").type("Testing2", {force: true});
    cy.get("#pass").should("have.value", "Testing2");

    cy.get("#login").click();

    cy.get("#profilePage").click();

    cy.get(".sidebarButton").eq(4).click();

    cy.get(".bp5-input-group").type("cypressTesting");

    cy.get(".bp5-popover-target").eq(1).click();

    cy.get('.bp5-popover-target').eq(3).click();
    // cy.get('.bp5-popover-target')
    //   .trigger('mousemove', { clientX: 0, clientY: 50 }) 
    //   .click({ force: true }); 

    cy.contains('Accept').click();

    cy.get(".sidebarButton").eq(0).click();
    cy.get(".sidebarButton").eq(4).click();
    cy.get(".bp5-popover-target").eq(0).click();
    cy.contains("cypressTesting").should("be.visible");

  });

  it("Remove Friend Test", () => {
    cy.get(".sidebarButton").eq(4).click();
    cy.contains("Friends").should("be.visible");

    cy.get(".bp5-input-group").type("cypressTesting2");
    cy.wait(500);

    cy.get(".bp5-popover-target").eq(0).click();
    cy.contains('Remove').click();
    cy.wait(1000);
    cy.contains('Remove').click({force: true});

    cy.get(".sidebarButton").eq(0).click();
    cy.get(".sidebarButton").eq(4).click();
    cy.get(".bp5-popover-target").eq(0).click();
    cy.wait(500);
    cy.contains("No friends").should("be.visible");
  });

//   it("Sidebar Test", () => {
//     cy.get(".sidebar").should("have.length", 1);

//     // cy.get('#sidebarButtonGroup').get('.sidebarButton').should('have.length', 4)

//     cy.get(".sidebarButton").eq(0).click();
//     cy.contains("Profile View").should("be.visible");

//     cy.get(".sidebarButton").eq(1).click();
//     cy.contains("Edit Profile").should("be.visible");

//     cy.get(".sidebarButton").eq(2).click();
//     cy.contains("Change Password").should("be.visible");

//     cy.get(".sidebarButton").eq(3).click();
//     cy.contains("Privacy and Security Settings").should("be.visible");
//   });

//   it("Edit and View Profile Tests", () => {
//     // resets cypresstesting on database
//     cy.request({
//       method: "POST",
//       url: "http://localhost:3001/cypressUserReset",
//       headers: {
//         documentid: "Du33v7g2VInEVppp6wNU",
//       },
//       body: {
//         username: "cypressTesting@gmail.com",
//         password: "Testing1",
//         isPrivate: false,
//         pfp: "",
//         bio: "",
//         topSongs: [],
//         topGenres: [],
//         topArtists: [],
//       },
//     });

//     cy.get(".sidebarButton").eq(1).click();

//     cy.wait(300);
//     cy.get("#biography-input").type("Very interesting biography");
//     cy.get("#biography-input").should(
//       "have.value",
//       "Very interesting biography"
//     );

//     cy.get(".top-multiselect").should("have.length", 3);
//     cy.get(".top-multiselect").eq(0).type("song1\nsong2\n");
//     cy.get(".top-multiselect").eq(1).type("Genre1\n");
//     cy.get(".top-multiselect").eq(2).type("singingRohan\n");

//     cy.get(".submit-button").click();
//     cy.wait(200);
//     cy.get(".sidebarButton").eq(0).click();
//     cy.contains("Very interesting biography").should("be.visible");
//     cy.contains("song1").should("be.visible");
//     cy.contains("song2").should("be.visible");
//     cy.contains("Genre1").should("be.visible");
//     cy.contains("singingRohan").should("be.visible");
//   });
});
