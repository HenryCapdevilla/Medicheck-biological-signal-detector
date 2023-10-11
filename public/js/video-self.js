// Crear una instancia de Socket.io y conectarse al servidor
const socket = io();
const videoCont = document.querySelector('.video-self');
const mic = document.querySelector('#mic');
const cam = document.querySelector('#webcam');
const btn_continue = document.querySelector('#continue_btn');

let micAllowed = 1;
let camAllowed = 1;

let mediaConstraints = { video: true, audio: true };

navigator.mediaDevices.getUserMedia(mediaConstraints)
    .then(localstream => {
        videoCont.srcObject = localstream;
    })

cam.addEventListener('click', () => {
        if (camAllowed) {
            mediaConstraints = { video: false, audio: micAllowed ? true : false };
            navigator.mediaDevices.getUserMedia(mediaConstraints)
                .then(localstream => {
                    videoCont.srcObject = localstream;
                })
    
            cam.classList = "nodevice";
            cam.innerHTML = `<i class="fas fa-video-slash"></i>`;
            camAllowed = 0;
        }
        else {
            mediaConstraints = { video: true, audio: micAllowed ? true : false };
            navigator.mediaDevices.getUserMedia(mediaConstraints)
                .then(localstream => {
                    videoCont.srcObject = localstream;
                })
    
            cam.classList = "device";
            cam.innerHTML = `<i class="fas fa-video"></i>`;
            camAllowed = 1;
        }
})

mic.addEventListener('click', () => {
    if (micAllowed) {
        mediaConstraints = { video: camAllowed ? true : false, audio: false };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        mic.classList = "nodevice";
        mic.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
        micAllowed = 0;
    }
    else {
        mediaConstraints = { video: camAllowed ? true : false, audio: true };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                videoCont.srcObject = localstream;
            })

        mic.innerHTML = `<i class="fas fa-microphone"></i>`;
        mic.classList = "device";
        micAllowed = 1;
    }
})

// Obtener la URL actual
const currentURL = window.location.href;

// Extraer el valor del parámetro 'room' de la URL
const roomid = new URL(currentURL).searchParams.get('room');
const nameInput = document.querySelector('#name-field');

btn_continue.addEventListener('click', (e) => {
    const username = nameInput.value;
    if (roomid) {
        socket.emit('join room', roomid, username);
        location.href = `/room.html?room=${roomid}&username=${username}`;
    } else {
        console.log('No se encontró un código de sala en la URL.');
    }
})