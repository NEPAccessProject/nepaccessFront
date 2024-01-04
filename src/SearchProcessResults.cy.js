import React from 'react'
import mockSearchProcessResultsProps from '../cypress/fixtures/mockSearchProcessResultsProps'
import results from '../cypress/fixtures/results'
import SearchProcessResults from './SearchProcessResults'

describe('<SearchProcessResults />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
    <SearchProcessResults 
      {...mockSearchProcessResultsProps}
    />)
  })
})