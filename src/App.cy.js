import React from 'react'
import App from './App'
import { createBrowserHistory } from 'history';


const history = createBrowserHistory();
describe('<App />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<App history={history} />)
  })
})