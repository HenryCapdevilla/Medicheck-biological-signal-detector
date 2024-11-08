import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css'; // Asegúrate de importar el CSS

function AdminPage() {
  const [nip, setNip] = useState('');
  const [whitelist, setWhitelist] = useState([]);
  const [message, setMessage] = useState('');

  const handleAddNip = async () => {
    try {
      const res = await axios.post('/api/admin/add-to-whitelist', { nip }, { withCredentials: true });
      setMessage(res.data.message || 'NIP added successfully');
      setNip('');
      fetchWhitelist();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding NIP');
    }
  };

  const fetchWhitelist = async () => {
    try {
      const res = await axios.get('/api/admin/whitelist', { withCredentials: true });
      setWhitelist(res.data);
    } catch (error) {
      setMessage('Error fetching whitelist');
    }
  };

  const handleDeleteNip = async (nipToDelete) => {
    try {
      const res = await axios.delete(`/api/admin/whitelist/${nipToDelete}`, { withCredentials: true });
      setMessage(res.data.message || 'NIP removed successfully');
      fetchWhitelist();
    } catch (error) {
      setMessage('Error deleting NIP');
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>

      <div>
        <input
          type="text"
          placeholder="Enter NIP"
          value={nip}
          onChange={(e) => setNip(e.target.value)}
          className="admin-input"
        />
        <button onClick={handleAddNip} className="admin-button">Add NIP</button>
      </div>

      <p className="message">{message}</p>

      <h2>Whitelist</h2>
      <ul className="nip-list">
        {whitelist.map((item) => (
          <li key={item.nip}>
            {item.nip}
            <button onClick={() => handleDeleteNip(item.nip)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
