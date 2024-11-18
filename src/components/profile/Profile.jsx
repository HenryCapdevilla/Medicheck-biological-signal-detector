import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import OffcanvasMenu from '../Offcanvas';

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
      return <p className="user-profile__message">No user data available</p>;
    }
  
    return (
      <StyledWrapper>
        <div className="card">
          <div className="profileImage">
            {/* SVG for user profile picture */}
          </div>
          <div className="userInfo">
            	<p>
            	  <strong>ID:</strong> {user.id}
            	</p>
            	<p>
            	  <strong>Username:</strong> {user.username}
            	</p>
            	<p>
            	  <strong>Email:</strong> {user.email}
            	</p>
					</div>
					<div className="userInfo">
            <p>
              <strong>Cédula ciudadana (NIP):</strong> {user.nip}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
					</div>
					<div className="userInfo">
            <p>
              <strong>Middle Name:</strong> {user.secondName || "N/A"}
            </p>
            <p>
              <strong>Last Name:</strong> {user.firstSurname}
            </p>
            <p>
              <strong>Second Last Name:</strong> {user.secondSurname || "N/A"}
            </p>
					</div>
					<div className="userInfo">
            <p>
              <strong>Birth Date:</strong> {user.birthDate}
            </p>
            <p>
              <strong>Created At:</strong> {user.createdAt}
            </p>
            <p>
              <strong>Updated At:</strong> {user.updatedAt}
            </p>
					<div className="userInfo">
						<p>
              <strong>Gender:</strong> {user.gender}
            </p>
					</div>
        </div>
        </div>
      </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
padding-top: 7em;
padding-left: 3em;
height: 60vh;
  .card {
    width: 90vw;
    background: rgb(39, 39, 39);
    border-radius: 12px;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.123);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    transition-duration: .5s;
		padding-left:20px;
  }

  .profileImage {
    background: linear-gradient(to right,rgb(54, 54, 54),rgb(32, 32, 32));
    margin-top: 20px;
    width: 170px;
    height: 170px;
    border-radius: 50%;
    box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.329);
  }

  .userInfo {
    width: 100%;
    text-align: left;
    padding: 5px;
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Two columns for larger screens */
    gap: 16px; /* Space between columns */
  }

  /* Make each user info section occupy a column in the grid */
  .userInfo p {
    font-size: 14px;
    color: #fff;
    font-weight: normal;
  }

  @media (max-width: 768px) {
    .userInfo {
      grid-template-columns: 1fr; /* Single column for smaller screens */
    }
  }

  .card:hover {
    background-color: rgb(43, 43, 43);
    box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
  }

  .card:active {
    background-color: rgb(28, 28, 28);
    box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.7);
  }
`;

export default Profile;
