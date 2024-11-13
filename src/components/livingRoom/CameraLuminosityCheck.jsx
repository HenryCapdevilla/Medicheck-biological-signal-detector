import React, { useEffect, useRef, useState } from 'react';
import './CameraLuminosityCheck.css';

function CameraLuminosityCheck({ videoRef }) {
  const canvasRef = useRef(null);
  const [brightness, setBrightness] = useState(0);

  const calculateBrightness = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const length = frame.data.length;
    let totalBrightness = 0;

    for (let i = 0; i < length; i += 4) {
      const r = frame.data[i];
      const g = frame.data[i + 1];
      const b = frame.data[i + 2];
      const avg = (r + g + b) / 3;
      totalBrightness += avg;
    }

    const avgBrightness = totalBrightness / (length / 4);
    setBrightness(avgBrightness);
  };

  useEffect(() => {
    const interval = setInterval(calculateBrightness, 1000);
    return () => clearInterval(interval);
  }, [videoRef]);

  return (
    <div className="camera-luminosity-container">
      <canvas ref={canvasRef} width={320} height={240} style={{ display: 'none' }}></canvas>
      <div className="luminosity-display">
        Luminosidad promedio: <span className="brightness-value">{brightness.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CameraLuminosityCheck;
