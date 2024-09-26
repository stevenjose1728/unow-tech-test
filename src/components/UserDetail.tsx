import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetail } from '../services/githubAPI';
import '../styles/Detail.scss';
import { User } from '../models/User';

const UserDetail = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const userDetails = await getUserDetail(username!);
      setUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!user) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="user-detail">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      <div className="user-card">
        <img src={user.avatar_url} alt={`${user.login} avatar`} className="avatar-large" />
        <h2>{user.name || 'No Name Available'}</h2>
        <p className="username">@{user.login}</p>
        {user.bio && <p className="bio">{user.bio}</p>}

        <div className="info">
          <span><strong>Location:</strong> {user.location || 'Location not available'}</span>
          <span><strong>Company:</strong> {user.company || 'Company not available'}</span>
          <span><strong>Website:</strong> {user.blog ? <a href={user.blog} target="_blank" rel="noopener noreferrer">{user.blog}</a> : 'Website not available'}</span>
          <span><strong>Public Repos:</strong> {user.public_repos}</span>
          <span><strong>Followers:</strong> {user.followers}</span>
          <span><strong>Following:</strong> {user.following}</span>
          <span><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
