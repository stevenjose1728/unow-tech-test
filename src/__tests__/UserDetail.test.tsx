import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import UserDetail from '../components/UserDetail';
import { getUserDetail } from '../services/githubAPI';

jest.mock('../services/githubAPI', () => ({
  getUserDetail: jest.fn(),
}));

const mockUser = {
  id: 1,
  login: 'svarelave',
  avatar_url: 'http://example.com/avatar.jpg',
  html_url: 'http://github.com/svarelave',
  type: 'User',
  public_repos: 10,
  followers: 5,
  name: 'Steven Varelave',
  company: 'GitHub',
  blog: 'https://svarelave.com',
  location: 'Argentina',
  bio: 'Software Developer',
  following: 3,
  created_at: '2015-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('UserDetail Component', () => {
  beforeEach(() => {
    (getUserDetail as jest.Mock).mockResolvedValue(mockUser);
  });
  test('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/user/svarelave']}>
        <Routes>
          <Route path="/user/:username" element={<UserDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Loading user details...')).toBeInTheDocument();
  });
  test('renders user details after fetching data', async () => {
    render(
      <MemoryRouter initialEntries={['/user/svarelave']}>
        <Routes>
          <Route path="/user/:username" element={<UserDetail />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Steven Varelave')).toBeInTheDocument();
      expect(screen.getByText('@svarelave')).toBeInTheDocument();
      expect(screen.getByText('Software Developer')).toBeInTheDocument();
      expect(screen.getByText('Argentina')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('https://svarelave.com')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // Public Repos
      expect(screen.getByText('5')).toBeInTheDocument();  // Followers
      expect(screen.getByText('3')).toBeInTheDocument();  // Following
    });
  });
  test('renders fallback text when data is missing', async () => {
    const mockUserWithoutDetails = {
      ...mockUser,
      name: undefined,
      company: undefined,
      location: undefined,
      blog: undefined,
    };
    (getUserDetail as jest.Mock).mockResolvedValueOnce(mockUserWithoutDetails);
    render(
      <MemoryRouter initialEntries={['/user/svarelave']}>
        <Routes>
          <Route path="/user/:username" element={<UserDetail />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('No Name Available')).toBeInTheDocument();
      expect(screen.getByText('Location not available')).toBeInTheDocument();
      expect(screen.getByText('Company not available')).toBeInTheDocument();
      expect(screen.getByText('Website not available')).toBeInTheDocument();
    });
  });

  test('navigates back when the back button is clicked', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    render(
      <MemoryRouter initialEntries={['/user/svarelave']}>
        <Routes>
          <Route path="/user/:username" element={<UserDetail />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Steven Varelave')).toBeInTheDocument();
    });
    const backButton = await screen.findByText('← Back');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
