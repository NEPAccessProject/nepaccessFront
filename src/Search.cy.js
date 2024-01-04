import React from 'react';
import Search from './Search';
import { mount } from 'cypress-react-unit-test';
import mockSearchProps  from '../cypress/fixtures/mockSearchProps';

describe('<Search />', () => {
  it('renders', () => {
    mount(<Search {...mockSearchProps} />);
    cy.get('input').should('be.visible');
  });

  it('renders with custom className', () => {
    mount(<Search {...mockSearchProps} className="my-class" />);
    cy.get('input').should('have.class', 'my-class');
  });

  it('renders with custom placeholder', () => {
    mount(<Search {...mockSearchProps} placeholder="Custom placeholder" />);
    cy.get('input').should('have.attr', 'placeholder', 'Custom placeholder');
  });
});