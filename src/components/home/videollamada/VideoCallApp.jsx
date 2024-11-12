import React, { useEffect, useRef, useState, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import { VideoContext } from "../../../context/videoProvider"; // Asegúrate de importar correctamente el VideoContext

import "./VIdeoCallApp.css";
import CameraToggleButton from "../../livingRoom/cameraToggleButton";
import MicrophoneToggleButton from "../../livingRoom/microphoneToggleButton";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

// Conecta el cliente con el servidor de Socket.IO en el puerto 8080
const socket = io.connect('http://localhost:8080');

// Componente principal de la aplicación de videollamada
const VideoCallApp = () => {
    // Accede al estado y funciones del VideoContext
    const { isCameraActive, isMicActive, toggleCamera, toggleMicrophone, startStream, stopStream, videoRef } = useContext(VideoContext);
	const { user } = useAuth();
    // Definición de los estados para manejar la información en el componente
    const [me, setMe] = useState(""); // Almacena el ID de usuario generado por Socket.IO
	const [stream, setStream ] = useState()
	//------------------------Importante-----------------------------------//
	const [receivingCall, setReceivingCall] = useState(false); // Indica si el usuario está recibiendo una llamada
    const [caller, setCaller] = useState(""); // ID del usuario que está llamando
    //------------------------Importante-----------------------------------//
	const [callerSignal, setCallerSignal] = useState(); // Señal del usuario que está llamando
    const [callAccepted, setCallAccepted] = useState(false); // Indica si la llamada fue aceptada
	//------------------------Importante-----------------------------------//

    const [idToCall, setIdToCall] = useState(""); // ID del usuario al que se quiere llamar
    const [callEnded, setCallEnded] = useState(false); // Indica si la llamada ha terminado
    const [name, setName] = useState(""); // Nombre del usuario local

    // Referencias para el video y la conexión
    const userVideo = useRef(); // Referencia al video del usuario remoto
    const connectionRef = useRef(); // Referencia a la conexión de `Peer`

    const { roomID } = useParams(); 

    // useEffect para registrar el usuario y configurar la conexión inicial con el servidor
    useEffect(() => {
        socket.emit("registerUser", { Username: user.username, RoomID:roomID }); // Enviar un email único al servidor

        socket.on("me", (id) => {
            console.log("ID del usuario:", id);
            setMe(id);
        });

        return () => {
            socket.off("me"); // Remover el evento cuando se desmonte el componente
        };
    }, []); // Solo se ejecuta al montar el componente

    // useEffect para obtener el stream de video y configurar el socket
    useEffect(() => {
        // Iniciar el stream cuando la cámara esté activa
        const fetchStream = async () => {
            console.log("Estado cámara: ", isCameraActive)
            if (isCameraActive) {
                const newStream = await startStream(true, isMicActive);
                console.log("Stream", newStream); // Verifica si stream es un MediaStream
                if (newStream && newStream.getTracks) {
                    console.log("stream es un MediaStream válido");
                } else {
                    console.log("stream no es un MediaStream válido");
                }
                if (newStream) {
                    setStream(newStream); // Asigna el stream al estado local
                }
            }
        };
        fetchStream(); // Llamada inicial de fetchStream

        // Evento 'callUser' para manejar la recepción de una llamada
        socket.on("callUser", (data) => {
            setReceivingCall(true); // Indica que se está recibiendo una llamada
            setCaller(data.from); // Almacena el ID del llamante
            setName(data.name); // Almacena el nombre del llamante
            setCallerSignal(data.signal); // Almacena la señal del llamante para establecer la conexión
        });

        return () => {
            stopStream(); // Detener el stream al desmontar el componente
        };
    }, [isCameraActive, isMicActive]);

    // Función para iniciar una llamada a otro usuario
    const callUser = (id) => {
		console.log("Stream", stream); // Verifica si stream es un MediaStream
		if (stream && stream.getTracks) {
		    console.log("stream es un MediaStream válido");
		} else {
		    console.log("stream no es un MediaStream válido");
		}

        const peer = new Peer({
            initiator: true, // Define que este usuario inicia la conexión
            trickle: false, // Desactiva la transmisión de señalización en modo "trickle"
            stream: stream, // Incluye el stream de video local
        });
		console.log("peer", peer)

        // Evento 'signal' para enviar datos de señalización al usuario remoto
        peer.on("signal", (data) => {
            socket.emit("callUser", { // Emite un evento al servidor con los datos de la llamada
                userToCall: id,
                signalData: data,
                from: me,
                name: name,
            });
        });

        // Evento 'stream' para recibir el stream de video del usuario remoto
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream; // Asigna el stream remoto a la referencia de video
        });

        // Evento para aceptar la llamada desde el servidor
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true); // Cambia el estado a llamada aceptada
            peer.signal(signal); // Completa la conexión de señalización con la señal remota
        });

        connectionRef.current = peer; // Almacena la referencia de la conexión
    };

    // Función para responder una llamada entrante
    const answerCall = () => {
        setCallAccepted(true); // Cambia el estado a llamada aceptada
        const peer = new Peer({
            initiator: false, // Define que este usuario responde la conexión
            trickle: false,
            stream: stream,
        });

        // Evento 'signal' para enviar la señal de respuesta al llamante
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });

        // Evento 'stream' para recibir el stream de video del usuario llamante
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal); // Completa la conexión de señalización con la señal del llamante
        connectionRef.current = peer;
    };

    // Función para finalizar la llamada
    const leaveCall = () => {
        setCallEnded(true); // Cambia el estado a llamada terminada
        connectionRef.current.destroy(); // Destruye la conexión de `Peer`
    };

    // Renderizado del componente
    return (
        <>
            <h1 style={{ textAlign: "center", color: "#fff" }}>Zoomish</h1>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        <p>{user.username}</p>
                        {/* Renderiza el video local */}
                        {stream && <video playsInline muted ref={videoRef} autoPlay style={{ width: "300px" }} />}
                    </div>
                    <div className="video">
                        {/* Renderiza el video remoto si la llamada está aceptada */}
                        {callAccepted && !callEnded ? (
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                        ) : null}
                    </div>
                </div>
                <div className="myId">
                    {/* Campo para ingresar el nombre del usuario */}
                    <TextField
                        id="filled-basic"
                        label="Name"
                        variant="filled"
                        value={user.username}
                        onChange={(e) => setName(user.username)}
                        style={{ marginBottom: "20px" }}
                    />
                    {/* Botón para copiar el ID del usuario */}
                    <CopyToClipboard
                        text={me || "ID no disponible"}
                        style={{ marginBottom: "2rem" }}
                        onCopy={() => {
                            if (me) {
                                console.log("ID copiado:", me);
                            } else {
                                console.log("El ID aún no está disponible");
                            }
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AssignmentIcon fontSize="large" />}
                        >
                            Copy ID
                        </Button>
                    </CopyToClipboard>
                    {/* Campo para ingresar el ID al que se desea llamar */}
                    <TextField
                        id="filled-basic"
                        label="ID to call"
                        variant="filled"
                        value={idToCall}
                        onChange={(e) => setIdToCall(e.target.value)}
                    />
                    {/* Aquí agregamos los botones para activar/desactivar cámara y micrófono */}
                    <div className="controls">
                        <CameraToggleButton isCameraActive={isCameraActive} toggleCamera={toggleCamera} />
                        <MicrophoneToggleButton isMicActive={isMicActive} toggleMicrophone={toggleMicrophone} />
                    </div>
                    {/* Botón para iniciar o finalizar la llamada */}
                    <div className="call-actions">
                        {callAccepted && !callEnded ? (
                            <Button variant="contained" color="secondary" onClick={leaveCall}>
                                End Call
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => callUser(idToCall)}>
                                Call
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mostrar la interfaz para recibir la llamada */}
            {receivingCall && !callAccepted && (
                <div className="caller">
                    <h1>{name} is calling...</h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                        Answer
                    </Button>
                </div>
            )}
        </>
    );
};

export default VideoCallApp;
