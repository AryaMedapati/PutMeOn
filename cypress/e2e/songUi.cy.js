describe("playlist functinality", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5002/login/");
      // cy.visit('http://localhost:5002/')
      // cy.visit('http://localhost:3000/login/')
      cy.wait(500);
  
      cy.get("#user").type("cypressTesting@gmail.com");
      cy.get("#user").should("have.value", "cypressTesting@gmail.com");
  
      cy.get("#pass").type("Testing1");
      cy.get("#pass").should("have.value", "Testing1");
  
      cy.get("#login").click();
    });
  
  
  it("SongUI Test", () => {
  
    cy.request({
        method: "POST",
        url: "http://localhost:3001/cypressUserReset",
        headers: {
          documentid: "Du33v7g2VInEVppp6wNU",
        },
        body: {
          username: "cypressTesting@gmail.com",
          password: "Testing1",
          isPrivate: false,
          pfp: "",
          bio: "",
          topSongs: [],
          topGenres: [],
          topArtists: [],
          pdf: "",
          playlists: [],
          friends_list: [],
          chats: [],
          sharedPlaylists: [],
          collabPlaylists: [],
        },
      });
    cy.wait(300)
  
  });
  
});
  