import React from 'react';
import './UserProfile.css';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de importar el hook

const UserProfile = () => {
  const { user } = useAuth(); // Usar useAuth dentro del componente

  console.log(user)
  if (!user) {
    return <p className="user-profile__message">No user data available</p>;
  }

  // Asegurarse de que las fechas sean válidas
  const createdAtDate = new Date(user.createdAt);
  const updatedAtDate = new Date(user.updatedAt);

  // Si las fechas son inválidas, mostrar un mensaje adecuado
  const createdAt = createdAtDate.toLocaleString() === "Invalid Date" ? "Date not available" : createdAtDate.toLocaleString();
  const updatedAt = updatedAtDate.toLocaleString() === "Invalid Date" ? "Date not available" : updatedAtDate.toLocaleString();

  return (
    <div className="user-profile">
      <h2 className="user-profile__title">User Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Created At:</strong> {createdAt}</p>
      <p><strong>Updated At:</strong> {updatedAt}</p>
    </div>
  );
};

export default UserProfile;
