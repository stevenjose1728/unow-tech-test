import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getUsers, getUserDetail, searchUsers } from '../services/githubAPI';
const mock = new MockAdapter(axios);
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
describe('GitHub API Functions', () => {
  afterEach(() => {
    mock.reset();
  });
  test('getUsers should fetch users from GitHub API', async () => {
    mock.onGet('https://api.github.com/users').reply(200, [mockUser]);
    const users = await getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual(mockUser);
  });
  test('getUserDetail should fetch user details from GitHub API', async () => {
    mock.onGet('https://api.github.com/users/svarelave').reply(200, mockUser);

    const user = await getUserDetail('svarelave');
    expect(user).toEqual(mockUser);
  });
  test('searchUsers should fetch users based on a query from GitHub API', async () => {
    mock.onGet('https://api.github.com/search/users?q=svarelave').reply(200, {
      items: [mockUser],
    });
    const users = await searchUsers('svarelave');
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual(mockUser);
  });
});
