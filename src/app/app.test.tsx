import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app';

test('renders header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Header/i);
  expect(linkElement).toBeInTheDocument();
});
