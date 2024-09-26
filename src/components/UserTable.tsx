import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { searchUsers } from '../services/githubAPI';
import { User } from '../models/User';
import '../styles/Table.scss';
import useGenerateRandomColor from '../hooks/useRandomColor';

ChartJS.register(ArcElement, Tooltip, Legend);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const UserTable = () => {
  const [generateColor] = useGenerateRandomColor();

  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const fetchUsers = async (filter: string) => {
    try {
      const results = await searchUsers(filter);
      setUsers(results);
    } catch (error) {
      console.error('Error fetching initial users:', error);
    }
  };
  const chartData = useMemo(() => {
    const labels = users.map(element => element.login)
    const colors = users.map(() => `#${generateColor()}`);
    const data = users.map(element => element.score || 0);
    const datasets = [
      {
        label: '# of stars',
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ]
    return {
      labels,
      datasets
    }
  }, [users]);

  useEffect(() => {
    if (filter !== 'iseijasunow')
      fetchUsers(filter);
    else
      setUsers([]);
  }, [filter]);

  return (
    <div className="user-table">
      <h2>GitHub Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      />
      {
        users.length ?
          <>

            <ul className="user-list">
              {
                users.map((user, i) => (
                  <li key={user.id}>
                    <div className="user-info">
                      <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar" />
                      <div className="details">
                        <span className="username">{user.login}</span>
                        <span className="type">Type: {user.type}</span>
                        <span className="repos">Public Repos:
                          <a href={user.repos_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                            View repos
                          </a>
                        </span>
                        <span className="followers">Followers:
                          <a href={user.followers_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                            View followers
                          </a>
                        </span>
                        <span className="followers">Stars: {user.score}</span>
                        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                          GitHub Profile
                        </a>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/user/${user.login}`)} className={`view-button view-button-${i}`}>View</button>
                  </li>
                ))
              }
            </ul>
            <Pie data={chartData} options={{
              plugins: {
                title: {
                  display: true,
                },
                legend: {
                  display: false
                }
              }
            }} />
          </>
          :
          'no users found'
      }
    </div>
  );
};

export default UserTable;
