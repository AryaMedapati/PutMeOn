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

    it("Playlist Test", () => {

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
      cy.get("#playlistPage").click();

      cy.contains("My Playlist").should("be.visible");
      cy.get('.create-playlist-button').eq(0).click()
      cy.get('.bp5-editable-text-content').type("New Testing Playlist 1")

      cy.get('.top-multiselect').type('song1\nsong2\nsong3\n')
      cy.get('.submit-button').click()
      cy.contains("New Testing Playlist 1").should("be.visible");

      cy.get('.edit-button').eq(0).click()
      cy.contains("song1").should("be.visible");
      cy.contains("song2").should("be.visible");
      cy.contains("song3").should("be.visible");

      cy.get('.delete-card-button').eq(0).click()
      cy.contains("song1").should("not.exist");

      cy.get('.cancel-button').click()
      cy.get('.edit-button').eq(0).click()
      cy.contains("song1").should("be.visible");

    });

  it("Share Playlist Test", () => {
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
        friends_list: ["cypressTesting2@gmail.com"],
        chats: [],
        sharedPlaylists: [],
        collabPlaylists: [],
      },
    });

    cy.request({
      method: "POST",
      url: "http://localhost:3001/cypressUserReset",
      headers: {
        documentid: "2xd2RDLGtG2zBDFOUMKv",
      },
      body: {
        username: "cypressTesting2@gmail.com",
        password: "Testing2",
        isPrivate: false,
        pfp: "",
        bio: "",
        topSongs: [],
        topGenres: [],
        topArtists: [],
        pdf: "",
        playlists: [],
        friends_list: ["cypressTesting@gmail.com"],
        chats: [],
        sharedPlaylists: [],
        collabPlaylists: [],
      },
    });
    cy.wait(300);

    cy.get("#playlistPage").click();

    cy.get(".create-playlist-button").eq(0).click();
    cy.get(".bp5-editable-text-content").type("New Testing Playlist 1");

    cy.get(".top-multiselect").type("song1\nsong2\nsong3\n");
    cy.get(".submit-button").click();

    cy.get(".share-button").eq(0).click();
    cy.wait(400);
    cy.get(".share-friend").eq(0).click();

    cy.visit("http://localhost:5002/login/");
    cy.get("#user").type("cypressTesting2@gmail.com");
    cy.get("#pass").type("Testing2");
    cy.get("#login").click();
    cy.wait(200)

    cy.get("#playlistPage").click();
    cy.contains("Shared Playlists").should("be.visible");
    cy.wait(300)
    cy.get("#playlistPage").click();

    // cy.contains("New Testing Playlist 1").should("be.visible");
  });
});
