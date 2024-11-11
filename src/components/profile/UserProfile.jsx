import React from 'react';
import './UserProfile.css';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="user-profile__message">No user data available</p>;
  }

  return (
    <div className="user-profile">
      <h2 className="user-profile__title">User Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Cédula ciudadana (NIP):</strong> {user.nip}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>First Name:</strong> {user.firstName}</p>
      <p><strong>Middle Name:</strong> {user.secondName || 'N/A'}</p>
      <p><strong>Last Name:</strong> {user.firstSurname}</p>
      <p><strong>Second Last Name:</strong> {user.secondSurname || 'N/A'}</p>
      <p><strong>Birth Date:</strong> {user.birthDate}</p>
      <p><strong>Created At:</strong> {user.createdAt}</p>
      <p><strong>Updated At:</strong> {user.updatedAt}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
    </div>
  );
};

export default UserProfile;
