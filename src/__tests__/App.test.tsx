import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../router', () => () => <div>Router Component</div>);
describe('App Component', () => {
  test('renders App component', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Router Component')).toBeInTheDocument();
  });
  test('contains main app div', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container.querySelector('.app')).toBeInTheDocument();
  });
});
