//react.dev api ket 3be424c42e2fe9caa7660072

describe("Should be able to login", () => {
  it("Login", () => {
    cy.visit("http://localhost:3000/"); 
    cy.get("loginBox").type("mySampleEmail@gmail.com");
  });
});