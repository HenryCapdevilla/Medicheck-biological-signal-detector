const socket = io();
const myvideo = document.querySelector("#vd1");
const roomid = params.get("room");
const username = params.get("username");
const chatRoom = document.querySelector('.chat-cont');
const sendButton = document.querySelector('.chat-send');
const messageField = document.querySelector('.chat-input');
const videoContainer = document.querySelector('#vcont');
const videoButt = document.querySelector('.novideo');
const audioButt = document.querySelector('.audio');
const cutCall = document.querySelector('.cutcall');
const screenShareButt = document.querySelector('.screenshare');
const continueButt = document.querySelector('.novideo');

let videoAllowed = 1;
let audioAllowed = 1;

let micInfo = {};
let videoInfo = {};

let videoTrackReceived = {};

let mymuteicon = document.querySelector("#mymuteicon");
mymuteicon.style.visibility = 'hidden';

let myvideooff = document.querySelector("#myvideooff");
myvideooff.style.visibility = 'hidden';

const configuration = { iceServers: [{ urls: "stun:stun2.1.google.com:19302" }] }

const mediaConstraints = { video: true, audio: true };

let connections = {};
let cName = {};
let audioTrackSent = {};
let videoTrackSent = {};

let mystream, myscreenshare;


document.querySelector('.roomcode').innerHTML = `${roomid}`
document.querySelector("#myname").innerHTML = `${username} (You)`;
socket.emit("join room", roomid, username);

function CopyClassText() {

    var textToCopy = document.querySelector('.roomcode');
    var currentRange;
    if (document.getSelection().rangeCount > 0) {
        currentRange = document.getSelection().getRangeAt(0);
        window.getSelection().removeRange(currentRange);
    }
    else {
        currentRange = false;
    }

    var CopyRange = document.createRange();
    CopyRange.selectNode(textToCopy);
    window.getSelection().addRange(CopyRange);
    document.execCommand("copy");

    window.getSelection().removeRange(CopyRange);

    if (currentRange) {
        window.getSelection().addRange(currentRange);
    }

    document.querySelector(".copycode-button").textContent = "Copied!"
    setTimeout(()=>{
        document.querySelector(".copycode-button").textContent = "Copy Code";
    }, 5000);
}

socket.on('user count', count => {
    console.log(count)
    if (count > 1) {
        videoContainer.className = 'video-cont';
    }
    else {
        videoContainer.className = 'video-cont-single';
    }
})

let peerConnection;

function handleGetUserMediaError(e) {
    switch (e.name) {
        case "NotFoundError":
            alert("Unable to open your call because no camera and/or microphone" +
                "were found.");
            break;
        case "SecurityError":
        case "PermissionDeniedError":
            break;
        default:
            alert("Error opening your camera and/or microphone: " + e.message);
            break;
    }

}


function reportError(e) {
    console.log(e);
    return;
}


function startCall() {
    console.log("Se inicio la llamada local")
    navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(localStream => {
            myvideo.srcObject = localStream;
            myvideo.muted = true;

            localStream.getTracks().forEach(track => {
                for (let key in connections) {
                    connections[key].addTrack(track, localStream);
                    if (track.kind === 'audio')
                        audioTrackSent[key] = track;
                    else
                        videoTrackSent[key] = track;
                }
            })

        })
        .catch(handleGetUserMediaError);
        navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then(localstream => {
            videoCont.srcObject = localstream;
        })

}

function handleVideoOffer(offer, sid, cname, micinf, vidinf) {

    console.log("primer código funcionando")

    cName[sid] = cname;
    console.log('video offered recevied');
    micInfo[sid] = micinf;
    videoInfo[sid] = vidinf;
    connections[sid] = new RTCPeerConnection(configuration);

    connections[sid].onicecandidate = function (event) {
        if (event.candidate) {
            console.log('icecandidate fired');
            socket.emit('new icecandidate', event.candidate, sid);
        }
    };

    let canvasContext;

    connections[sid].ontrack = function (event) {

        if (!document.getElementById(sid)) {
            console.log('track event fired')
            let vidCont = document.createElement('div');
            let newvideo = document.createElement('video');
            let name = document.createElement('div');
            let muteIcon = document.createElement('div');
            let videoOff = document.createElement('div');
            videoOff.classList.add('video-off');
            muteIcon.classList.add('mute-icon');
            name.classList.add('nametag');
            name.innerHTML = `${cName[sid]}`;
            vidCont.id = sid; //Añade un id del otro usuario
            muteIcon.id = `mute${sid}`;
            videoOff.id = `vidoff${sid}`;
            muteIcon.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
            videoOff.innerHTML = 'Video Off'
            vidCont.classList.add('video-box');//Añade un cuadro para mostrar la imagen
            newvideo.classList.add('video-frame'); //Añade los frames obtenidos de la cámara del otro user
            newvideo.autoplay = true;
            newvideo.playsinline = true;
            newvideo.id = `video${sid}`;
            newvideo.srcObject = event.streams[0];

            if (micInfo[sid] == 'on')
                muteIcon.style.visibility = 'hidden';
            else
                muteIcon.style.visibility = 'visible';

            if (videoInfo[sid] == 'on')
                    videoOff.style.visibility = 'hidden';
                else
                    videoOff.style.visibility = 'visible';

                vidCont.appendChild(newvideo);
                vidCont.appendChild(name);
                vidCont.appendChild(muteIcon);
                vidCont.appendChild(videoOff);

                videoContainer.appendChild(vidCont);

                const imageElement = document.querySelector('#captured-image');

                function captureFrame() {
                    if (canvasContext) {
                        // Dibujar el frame actual del video en el lienzo
                        canvasContext.drawImage(newvideo, 0, 0, canvas.width, canvas.height);
                        
                        // Convertir el frame en una imagen base64
                        const frameDataURL = canvas.toDataURL('image/png');
                        
                        // Almacenar el frame en el arreglo 'frames'
                        frames.push(frameDataURL);

                        // Mostrar la imagen en el elemento <img>
                        imageElement.src = frameDataURL;
                        
                        // Llamar a 'captureFrame' nuevamente para el próximo frame
                        requestAnimationFrame(captureFrame);
                    }
                }

                captureFrame(); // Inicia la captura de frames
        }
    };  

    connections[sid].onremovetrack = function (event) {
        if (document.getElementById(sid)) {
            document.getElementById(sid).remove();
            console.log('removed a track');
        }
    };

    connections[sid].onnegotiationneeded = function () {

        connections[sid].createOffer()
            .then(function (offer) {
                return connections[sid].setLocalDescription(offer);
            })
            .then(function () {

                socket.emit('video-offer', connections[sid].localDescription, sid);

            })
            .catch(reportError);
    };

    let desc = new RTCSessionDescription(offer);

    connections[sid].setRemoteDescription(desc)
        .then(() => { return navigator.mediaDevices.getUserMedia(mediaConstraints) })
        .then((localStream) => {

            localStream.getTracks().forEach(track => {
                connections[sid].addTrack(track, localStream);
                console.log('added local stream to peer')
                if (track.kind === 'audio') {
                    audioTrackSent[sid] = track;
                    if (!audioAllowed)
                        audioTrackSent[sid].enabled = false;
                }
                else {
                    videoTrackSent[sid] = track;
                    if (!videoAllowed)
                        videoTrackSent[sid].enabled = false
                }
            })

        })
        .then(() => {
            return connections[sid].createAnswer();
        })
        .then(answer => {
            return connections[sid].setLocalDescription(answer);
        })
        .then(() => {
            socket.emit('video-answer', connections[sid].localDescription, sid);
        })
        .catch(handleGetUserMediaError);


}

function handleNewIceCandidate(candidate, sid) {
    console.log('new candidate recieved')
    var newcandidate = new RTCIceCandidate(candidate);

    connections[sid].addIceCandidate(newcandidate)
        .catch(reportError);
}

function handleVideoAnswer(answer, sid) {
    console.log('answered the offer')
    const ans = new RTCSessionDescription(answer);
    connections[sid].setRemoteDescription(ans);
}

//Thanks to (https://github.com/miroslavpejic85) for ScreenShare Code


//Compartir pantalla
screenShareButt.addEventListener('click', () => {
    screenShareToggle();
});
let screenshareEnabled = false;
function screenShareToggle() {
    let screenMediaPromise;
    if (!screenshareEnabled) {
        if (navigator.getDisplayMedia) {
            screenMediaPromise = navigator.getDisplayMedia({ video: true });
        } else if (navigator.mediaDevices.getDisplayMedia) {
            screenMediaPromise = navigator.mediaDevices.getDisplayMedia({ video: true });
        } else {
            screenMediaPromise = navigator.mediaDevices.getUserMedia({
                video: { mediaSource: "screen" },
            });
        }
    } else {
        screenMediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
    }
    screenMediaPromise
        .then((myscreenshare) => {
            screenshareEnabled = !screenshareEnabled;
            for (let key in connections) {
                const sender = connections[key]
                    .getSenders()
                    .find((s) => (s.track ? s.track.kind === "video" : false));
                sender.replaceTrack(myscreenshare.getVideoTracks()[0]);
            }
            myscreenshare.getVideoTracks()[0].enabled = true;
            const newStream = new MediaStream([
                myscreenshare.getVideoTracks()[0], 
            ]);
            myvideo.srcObject = newStream;
            myvideo.muted = true;
            mystream = newStream;
            screenShareButt.innerHTML = (screenshareEnabled 
                ? `<i class="fas fa-desktop"></i><span class="tooltiptext">Stop Share Screen</span>`
                : `<i class="fas fa-desktop"></i><span class="tooltiptext">Share Screen</span>`
            );
            myscreenshare.getVideoTracks()[0].onended = function() {
                if (screenshareEnabled) screenShareToggle();
            };
        })
        .catch((e) => {
            alert("Unable to share screen:" + e.message);
            console.error(e);
        });
}
//Compartir pantalla
socket.on('video-offer', handleVideoOffer);

socket.on('new icecandidate', handleNewIceCandidate);

socket.on('video-answer', handleVideoAnswer);


socket.on('join room', async (conc, cnames, micinfo, videoinfo) => {
    console.log("Segundo código funcionando")
    socket.emit('getCanvas');
    if (cnames)
        cName = cnames;

    if (micinfo)
        micInfo = micinfo;

    if (videoinfo)
        videoInfo = videoinfo;


    console.log(cName);
    if (conc) {
        await conc.forEach(sid => {
            connections[sid] = new RTCPeerConnection(configuration);

            connections[sid].onicecandidate = function (event) {
                if (event.candidate) {
                    console.log('icecandidate fired');
                    socket.emit('new icecandidate', event.candidate, sid);
                }
            };

            connections[sid].ontrack = function (event) {

                if (!document.getElementById(sid)) {
                    console.log('track event fired')
                    let vidCont = document.createElement('div');
                    let newvideo = document.createElement('video');
                    let name = document.createElement('div');
                    let muteIcon = document.createElement('div');
                    let videoOff = document.createElement('div');
                    videoOff.classList.add('video-off');
                    muteIcon.classList.add('mute-icon');
                    name.classList.add('nametag');
                    name.innerHTML = `${cName[sid]}`;
                    vidCont.id = sid;
                    muteIcon.id = `mute${sid}`;
                    videoOff.id = `vidoff${sid}`;
                    muteIcon.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
                    videoOff.innerHTML = 'Video Off'
                    vidCont.classList.add('video-box');
                    newvideo.classList.add('video-frame');
                    newvideo.autoplay = true;
                    newvideo.playsinline = true;
                    newvideo.id = `video${sid}`;
                    newvideo.srcObject = event.streams[0];

                    if (micInfo[sid] == 'on')
                        muteIcon.style.visibility = 'hidden';
                    else
                        muteIcon.style.visibility = 'visible';

                    if (videoInfo[sid] == 'on')
                        videoOff.style.visibility = 'hidden';
                    else
                        videoOff.style.visibility = 'visible';

                    vidCont.appendChild(newvideo);
                    vidCont.appendChild(name);
                    vidCont.appendChild(muteIcon);
                    vidCont.appendChild(videoOff);

                    videoContainer.appendChild(vidCont);
                }
            };

            connections[sid].onremovetrack = function (event) {
                if (document.getElementById(sid)) {
                    document.getElementById(sid).remove();
                }
            }

            connections[sid].onnegotiationneeded = function () {

                connections[sid].createOffer()
                    .then(function (offer) {
                        return connections[sid].setLocalDescription(offer);
                    })
                    .then(function () {

                        socket.emit('video-offer', connections[sid].localDescription, sid);

                    })
                    .catch(reportError);
            };

        });

        console.log('added all sockets to connections');
        startCall();

    }
    else {
        console.log('waiting for someone to join');
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localStream => {
                myvideo.srcObject = localStream;
                myvideo.muted = true;
                mystream = localStream;
            })
            .catch(handleGetUserMediaError);
    }
})

//Eliminación del participante por ID (sid)
socket.on('remove peer', sid => {
    if (document.getElementById(sid)) {
        document.getElementById(sid).remove();
    }

    delete connections[sid];
})
//

//Selector del video videobutt
videoButt.addEventListener('click', () => {

    if (videoAllowed) {
        for (let key in videoTrackSent) {
            videoTrackSent[key].enabled = false;
        }
        videoButt.innerHTML = `<i class="fas fa-video-slash"></i>`;
        videoAllowed = 0;
        videoButt.style.backgroundColor = "#b12c2c";

        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = false;
                }
            })
        }

        myvideooff.style.visibility = 'visible';

        socket.emit('action', 'videooff');
    }
    else {
        for (let key in videoTrackSent) {
            videoTrackSent[key].enabled = true;
        }
        videoButt.innerHTML = `<i class="fas fa-video"></i>`;
        videoAllowed = 1;
        videoButt.style.backgroundColor = "#4ECCA3";
        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'video')
                    track.enabled = true;
            })
        }


        myvideooff.style.visibility = 'hidden';

        socket.emit('action', 'videoon');
    }
})


audioButt.addEventListener('click', () => {

    if (audioAllowed) {
        for (let key in audioTrackSent) {
            audioTrackSent[key].enabled = false;
        }
        audioButt.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
        audioAllowed = 0;
        audioButt.style.backgroundColor = "#b12c2c";
        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'audio')
                    track.enabled = false;
            })
        }

        mymuteicon.style.visibility = 'visible';

        socket.emit('action', 'mute');
    }
    else {
        for (let key in audioTrackSent) {
            audioTrackSent[key].enabled = true;
        }
        audioButt.innerHTML = `<i class="fas fa-microphone"></i>`;
        audioAllowed = 1;
        audioButt.style.backgroundColor = "#4ECCA3";
        if (mystream) {
            mystream.getTracks().forEach(track => {
                if (track.kind === 'audio')
                    track.enabled = true;
            })
        }

        mymuteicon.style.visibility = 'hidden';

        socket.emit('action', 'unmute');
    }
})

socket.on('action', (msg, sid) => {
    if (msg == 'mute') {
        console.log(sid + ' muted themself');
        document.querySelector(`#mute${sid}`).style.visibility = 'visible';
        micInfo[sid] = 'off';
    }
    else if (msg == 'unmute') {
        console.log(sid + ' unmuted themself');
        document.querySelector(`#mute${sid}`).style.visibility = 'hidden';
        micInfo[sid] = 'on';
    }
    else if (msg == 'videooff') {
        console.log(sid + 'turned video off');
        document.querySelector(`#vidoff${sid}`).style.visibility = 'visible';
        videoInfo[sid] = 'off';
    }
    else if (msg == 'videoon') {
        console.log(sid + 'turned video on');
        document.querySelector(`#vidoff${sid}`).style.visibility = 'hidden';
        videoInfo[sid] = 'on';
    }
})


cutCall.addEventListener('click', () => {
    location.href = '/';
})