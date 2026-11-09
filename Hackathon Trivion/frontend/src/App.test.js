import { render, screen } from '@testing-library/react';
import App from './App';

test('renders vehicle service center management system heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', {
    name: /vehicle service center management system/i,
  });
  expect(headingElement).toBeInTheDocument();
});
