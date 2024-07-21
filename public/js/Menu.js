const controls = document.querySelector('.controls');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const recordedVideo = document.getElementById('recordedVideo');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;
const [play, pause, screenshot, startRecording, stopRecording] = buttons;
const constraints = {
    video: {
        width: {
            min: 480,
            ideal: 720,
            max: 1500,
        },
        height: {
            min: 720,
            ideal: 720,
            max: 1440
        },
    }
};
let mediaRecorder;
let recordedChunks = [];
let heartRateChart; // Variable para almacenar la instancia del gráfico
let labels; // Declara la variable labels fuera de la función then

const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
};

play.onclick = () => {
    if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
            ...constraints
        };
        startStream(updatedConstraints);
    }
};

const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
};

const handleStream = (stream) => {
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    screenshot.classList.remove('d-none');
    startRecording.classList.remove('d-none');
    streamStarted = true;
};

getCameraSelection();

const pauseStream = () => {
    video.pause();
    play.classList.remove('d-none');
    pause.classList.add('d-none');
};

const startRecordingVideo = () => {
    recordedChunks = [];
    const stream = video.srcObject;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        // Enviar el blob al servidor
        const formData = new FormData();
        formData.append('video', blob, 'recorded-video.webm');
            
        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log('Video uploaded and processed successfully');
                console.log('g_values:', data.g_values);
        
                // Actualizar la gráfica con los nuevos valores
                updateChart(data);
            } else {
                console.error('Video upload or processing failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        const url = URL.createObjectURL(blob);
        recordedVideo.src = url;
        recordedVideo.classList.remove('d-none');
    };

    mediaRecorder.start();
    startRecording.classList.add('d-none');
    stopRecording.classList.remove('d-none');
};

const stopRecordingVideo = () => {
    mediaRecorder.stop();
    startRecording.classList.remove('d-none');
    stopRecording.classList.add('d-none');
};

pause.onclick = pauseStream;
startRecording.onclick = startRecordingVideo;
stopRecording.onclick = stopRecordingVideo;

function updateChart(data) {
    // Actualizar el contenido HTML con los valores recibidos
    const gValuesElement = document.getElementById('gValues');
    const gValues = data.g_values.join(', ');
    //gValuesElement.textContent = `g_values: ${gValues}`;

    // Crear un array de etiquetas para el eje X basado en la longitud de g_values
    labels = data.g_values.map((_, i) => (i + 1).toString());

    // Obtener el valor mínimo y máximo de g_values
    const minValue = Math.min(...data.g_values);
    const maxValue = Math.max(...data.g_values);

    // Si el gráfico ya existe, actualizar sus datos y opciones
    if (heartRateChart) {
        heartRateChart.data.labels = labels;
        heartRateChart.data.datasets[0].data = data.g_values;
        heartRateChart.options.scales.y.suggestedMin = minValue - 10 < 0 ? 0 : minValue - 10;
        heartRateChart.options.scales.y.suggestedMax = maxValue + 10;
        heartRateChart.update();
    } else {
        // Configuración de Chart.js
        const ctx = document.getElementById('heartRateChart').getContext('2d');

        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ritmo Cardiaco',
                        data: data.g_values,
                        borderColor: '#00FF00', // Verde más brillante
                        fill: false,
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4
                    },
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Signo Vital',
                        color: 'white' // Color del título
                    },
                },
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            color: 'white' // Color del título del eje X
                        },
                        ticks: {
                            color: 'white' // Color de las etiquetas del eje X
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value',
                            color: 'white' // Color del título del eje Y
                        },
                        ticks: {
                            color: 'white' // Color de las etiquetas del eje Y
                        },
                        suggestedMin: minValue - 10 < 0 ? 0 : minValue - 10,
                        suggestedMax: maxValue + 10
                    }
                }
            }
        };

        // Crear el gráfico
        heartRateChart = new Chart(ctx, config);
    }
}