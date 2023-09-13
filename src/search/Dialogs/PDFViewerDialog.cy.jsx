import React from 'react'
import PDFViewerDialog from './PDFViewerDialog'

describe('<PDFViewerDialog />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PDFViewerDialog />)
  })
})