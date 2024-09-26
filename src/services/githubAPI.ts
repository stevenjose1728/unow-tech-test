// githubAPI.ts
import axios from 'axios';
import { User } from '../models/User';

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get('https://api.github.com/users');
  return response.data;
};
export const getUserDetail = async (username: string): Promise<User> => {
  const response = await axios.get(`https://api.github.com/users/${username}`);
  return response.data;
};
export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await axios.get(`https://api.github.com/search/users?q=${query}`);
  return response.data.items;
};