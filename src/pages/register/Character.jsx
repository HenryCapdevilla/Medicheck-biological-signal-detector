import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="heart">
        <span className="loader" />
      </div>
      <div className="loading">
        <svg>
          {/* Modified polyline with smaller trajectory */}
          <polyline points="0.157 15, 14 15, 21.843 30, 33 0, 37 15, 43 15" id="back" />
          <polyline points="0.157 15, 14 15, 21.843 30, 33 0, 37 15, 43 15" id="front" />
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  width: 100%;

  /* Heart position */
  .heart {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0; /* Heart is at the back */
  }

  /* Loader heart animation */
  .loader {
    position: relative;
    width: 40px;  /* Reduced size */
    height: 60px; /* Reduced size */
    animation: heartBeat 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .loader:before,
  .loader:after {
    content: "";
    background: red;
		width: 40px;
		height: 66px;
    border-radius: 50px 50px 0 0;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: rotate(45deg);
    transform-origin: 50% 70%;
    box-shadow: 5px 4px 5px #0004 inset;
  }

  .loader:after {
    transform: rotate(-45deg);
  }

  /* Sign vital position */
  .loading {
    z-index: 1; /* Sign vital is above the heart */
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading svg {
    width: 40px;  /* Reduced width */
    height: 35px; /* Reduced height */
  }

  .loading svg polyline {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .loading svg polyline#back {
    fill: none;
    stroke: #ff4d5033; /* Red background stroke for the sign */
  }

  .loading svg polyline#front {
    fill: none;
    stroke: white; /* White stroke for the vital sign */
    stroke-dasharray: 48, 144;
    stroke-dashoffset: 192;
    animation: dash_682 1.4s linear infinite;
  }

  @keyframes dash_682 {
    72.5% {
      opacity: 0;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  /* Heartbeat animation */
  @keyframes heartBeat {
    0% {
      transform: scale(0.95);
    }
    5% {
      transform: scale(1.1);
    }
    39% {
      transform: scale(0.85);
    }
    45% {
      transform: scale(1);
    }
    60% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(0.9);
    }
  }
`;

export default Loader;
