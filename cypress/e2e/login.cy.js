it('logs user in', () => {
  cy.session('gms', () => {
    login();
    cy.get('#admin-button').should('contain', 'Admin');
  });
});
it('logs user out', () => {
  cy.session('logout', () => {
    login();
    cy.get('#admin-button').should('contain', 'Admin');
    // Caching session when logging in via API
    logout();
    })
  });

const ApiLogin = () => {
  cy.request({
    method: 'POST',
    url: 'https://bighorn.sbs.arizona.edu:8443/nepaBackend/login/',
    body: { 
        'username': 'gms',
        'password':'252MYA=Doom!' 
    },
  }).then((res) => {
    cy.log(`ApiLogin ~ res:`, res);
    window.localStorage.setItem('authToken', body.token)
  })
}

const login = () => {
  cy.log('Logging in');
  cy.visit('https://www.nepaccess.org/').then((args) => {
    cy.log(`cy.visit ~ args:`, args);

    cy.get('a[href="/login"]').click();
    cy.url().should('contain', '/login');
    cy.get('input#username').type('gms');
    cy.get('input#password').type('252MYA=Doom!');
    cy.get('button#login-submit').click();
  });
}

const logout = () => {
  cy.log('Logging out');
  cy.clearAllCookies();
  cy.clearAllCookies({ domain: '.nepaccess.org' });

}

afterEach(() => {
  logout();
})

