import { useEffect, useRef, useState } from 'react';

const useBrightness = (videoRef) => {
  const canvasRef = useRef(document.createElement('canvas')); // Canvas virtual
  const [brightness, setBrightness] = useState(0);

  const calculateBrightness = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;

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
    let animationFrameId;

    const updateBrightness = () => {
      calculateBrightness();
      animationFrameId = requestAnimationFrame(updateBrightness);
    };

    updateBrightness();

    return () => cancelAnimationFrame(animationFrameId);
  }, [videoRef]);

  return { brightness, canvasRef }; // Devuelve brillo y referencia al canvas
};

export default useBrightness;
