describe("/test", () => {
  it("should assert that /test is working", () => {
    cy.request("/test").then(response => {
      expect(response.body).to.have.property("message", "Hello World!");
    });
  });
});
