import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserTable from '../components/UserTable';
jest.mock('../services/githubAPI', () => ({
  searchUsers: jest.fn().mockResolvedValue([
    {
      id: 1,
      login: 'svarelave',
      avatar_url: 'http://example.com/avatar.jpg',
      html_url: 'http://github.com/svarelave',
      type: 'User',
      public_repos: 10,
      followers: 5,
    },
    {
      id: 2,
      login: 'anotheruser',
      avatar_url: 'http://example.com/avatar2.jpg',
      html_url: 'http://github.com/anotheruser',
      type: 'User',
      public_repos: 8,
      followers: 4,
    },
  ]),
}));
describe('UserTable Component', () => {
  test('renders initial user table', async () => {
    render(
      <MemoryRouter>
        <UserTable />
      </MemoryRouter>
    );
    expect(await screen.findByText('GitHub Users')).toBeInTheDocument();
    expect(await screen.findByText('svarelave')).toBeInTheDocument();
    expect(await screen.findByText('anotheruser')).toBeInTheDocument();
  });

  test('filters users based on search input', async () => {
    render(
      <MemoryRouter>
        <UserTable />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(input, { target: { value: 'svarelave' } });
    expect(await screen.findByText('svarelave')).toBeInTheDocument();
  });

  test('renders view buttons for each user', async () => {
    render(
      <MemoryRouter>
        <UserTable />
      </MemoryRouter>
    );
    const viewButtons = await screen.findAllByText(/View/i);
    expect(viewButtons).toHaveLength(2);
  });

  test('displays no users message if search results are empty', async () => {
    jest.mock('../services/githubAPI', () => ({
      searchUsers: jest.fn().mockResolvedValue([]),
    }));
    render(
      <MemoryRouter>
        <UserTable />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(input, { target: { value: 'iseijasunow' } });
    const noUsersMessage = await screen.findByText(/no users found/i);
    expect(noUsersMessage).toBeInTheDocument();
  });
});
