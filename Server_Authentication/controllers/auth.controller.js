import User from '../models/user.model.js';
import Whitelist from '../models/MedicoWhitelist.js'; // Asegúrate de importar el modelo de la whitelist
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../src/config.js';

// Controlador para el registro de usuarios
export const register = async (req, res) => {
    // Extrae los datos de la solicitud
    const { email, password, username, nip } = req.body;
    try {
        // Verifica si el correo ya está registrado
        const userFound = await User.findOne({ email });
        if (userFound)
            return res.status(400).json(['The email already exists']);

        // Verifica si el nombre de usuario ya está registrado
        const usernameFound = await User.findOne({ username });
        if (usernameFound)
            return res.status(400).json(['The username already exists']);

        // Verifica si la cédula (NIP) ya está registrada
        const nipFound = await User.findOne({ nip });
        if (nipFound)
            return res.status(400).json(['The NIP already exists']);

        // Verifica si el NIP está en la whitelist (solo médicos)
        const isInWhitelist = await Whitelist.findOne({ nip });
        const role = isInWhitelist ? 'medico' : 'paciente'; // Si está en la whitelist, es médico

        // Cifra la contraseña antes de almacenarla
        const passwordHash = await bcrypt.hash(password, 10);

        // Crea un nuevo usuario con los datos proporcionados
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            nip, // Cédula
			role, // Asignar el rol según la verificación de la whitelist
        });

        // Guarda el nuevo usuario en la base de datos
        const userSaved = await newUser.save();
        
        // Genera un token de acceso para el usuario
        const token = await createAccessToken({ id: userSaved._id });

        // Envía la cookie con el token al cliente
        res.cookie("token", token);

        // Responde con los datos del usuario recién creado
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
            nip: userSaved.nip, // Incluye el # cédula en la respuesta
						role: userSaved.role, // Incluye el rol en la respuesta
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            message: error.message
        });
    }
};

// Controlador para el inicio de sesión
export const login = async (req, res) => {
    // Extrae los datos de la solicitud
    const { email, password } = req.body;
    try {
        // Verifica si el usuario existe
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json(["User not found"]);

        // Verifica si la contraseña es correcta
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json(["Incorrect password"]);

        // Genera un token de acceso para el usuario
        const token = await createAccessToken({ id: userFound._id });

        // Envía la cookie con el token al cliente
        res.cookie("token", token);

        // Responde con los datos del usuario
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            nip: userFound.nip, // Incluye el rol en la respuesta
						role: userFound.role, // Incluye el rol en la respuesta
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            message: error.message
        });
    }
};

// Controlador para cerrar sesión
export const logout = (req, res) => {
    // Elimina la cookie del token estableciendo su expiración en una fecha pasada
    res.cookie('token', "", {
        expires: new Date(0),
    });
    return res.sendStatus(200); // Responde con un estado 200 OK
};

// Controlador para obtener el perfil del usuario
export const profile = async (req, res) => {
    // Busca al usuario por su ID obtenido del token
    const userFound = await User.findById(req.user.id);

    if (!userFound) return res.status(400).json({
        message: "User not found"
    });

    // Responde con los datos del usuario
    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,  // Convierte a string ISO
        updatedAt: userFound.updatedAt,  // Convierte a string ISO
        nip: userFound.nip, // Incluye el rol en la respuesta
				role: userFound.role, // Incluye el rol en la respuesta
    });
};

// Controlador para verificar el token de acceso
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verifica la validez del token
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });

        // Busca al usuario por su ID obtenido del token
        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "Unauthorized" });

        // Vuelve a enviar la cookie con el token al cliente
        res.cookie("token", token, {
            sameSite: "None",
        });

        // Responde con los datos del usuario
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            nip: userFound.nip, // Incluye el rol en la respuesta
						role: userFound.role, // Incluye el rol en la respuesta
        });
    });
};