import User from '../models/user.model.js';
import Whitelist from '../models/MedicoWhitelist.js'; // Asegúrate de importar el modelo de la whitelist
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../src/config.js';

export const register = async (req, res) => {
    console.log('Request Body:', req.body); // Asegúrate de que los datos estén llegando correctamente
    // Destructuring con los nombres correctos de los campos
    const { firstName, secondName, firstSurname, secondSurname, birthDate, gender, username, email, password, nip } = req.body;

    // Logs para cada campo
    console.log('firstName:', firstName);
    console.log('secondName:', secondName);
    console.log('firstSurname:', firstSurname);
    console.log('secondSurname:', secondSurname);
    console.log('birthDate:', birthDate);
    console.log('gender:', gender);
    console.log('username:', username);
    console.log('email:', email);
    console.log('password:', password);
    console.log('nip:', nip);
    try {
        // Validaciones de entrada
        if (!email || !password || !username || !nip || !firstName || !secondName || !birthDate || !gender || !firstSurname || !secondSurname) {
            return res.status(400).json(['All fields are required']);
        }

        // Verifica si el correo ya está registrado
        const userFound = await User.findOne({ email });
        if (userFound) {
            console.log('Email already exists');
            return res.status(400).json(['The email already exists']);
        }

        // Verifica si el nombre de usuario ya está registrado
        const usernameFound = await User.findOne({ username });
        if (usernameFound) {
            console.log('Username already exists');
            return res.status(400).json(['The username already exists']);
        }

        // Verifica si la cédula (NIP) ya está registrada
        const nipFound = await User.findOne({ nip });
        if (nipFound) {
            console.log('NIP already exists');
            return res.status(400).json(['The NIP already exists']);
        }

        // Verifica si el NIP está en la whitelist (solo médicos)
        const isInWhitelist = await Whitelist.findOne({ nip });
        const role = isInWhitelist ? 'medico' : 'paciente';

        // Cifra la contraseña antes de almacenarla
        const passwordHash = await bcrypt.hash(password, 10);

        // Crea un nuevo usuario con los datos proporcionados
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            nip,
            role,
            firstName,
            secondName,
            firstSurname,
            secondSurname,
            birthDate,
            gender,
        });

        // Guarda el nuevo usuario en la base de datos
        const userSaved = await newUser.save();
        console.log('User saved successfully:', userSaved);

        // Genera un token de acceso para el usuario
        const token = await createAccessToken({ id: userSaved._id });

        res.cookie('token', token, {
            httpOnly: true, // Seguridad, la cookie no se puede acceder con JavaScript
            secure: true, // Solo si la aplicación está en producción (HTTPS)
            sameSite: 'None', // Permite que la cookie se envíe en contextos cross-origin
            maxAge: 24 * 60 * 60 * 1000 // Duración de la cookie (1 día)
        });
        

        // Responde con los datos del usuario recién creado
        res.status(201).json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            nip: userSaved.nip,
            role: userSaved.role,
            firstName: userSaved.firstName,
            secondName: userSaved.secondName,
            firstSurName: userSaved.firstSurName,
            secondSurName: userSaved.secondSurname,
            birthDate: userSaved.birthDate,
            gender: userSaved.gender,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });
    } catch (error) {
        // Manejo de errores con más detalles
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
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
        console.log("token login", token);
        // Envía la cookie con el token al cliente
        res.cookie('token', token, {
            httpOnly: true, // Seguridad, la cookie no se puede acceder con JavaScript
            secure: true, // Solo si la aplicación está en producción (HTTPS)
            sameSite: 'None', // Permite que la cookie se envíe en contextos cross-origin
            maxAge: 24 * 60 * 60 * 1000 // Duración de la cookie (1 día)
        });
        

        // Responde con los datos del usuario
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            nip: userFound.nip,
            role: userFound.role,
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
    try {
        // Busca al usuario por su ID obtenido del token
        const userFound = await User.findById(req.user.id);

        if (!userFound) {
            return res.status(400).json({ message: "User not found" });
        }

        // Log de la información del usuario
        console.log('User found:', {
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            nip: userFound.nip,
            role: userFound.role,
            firstName: userFound.firstName,
            secondName: userFound.secondName,
            firstSurname: userFound.firstSurname,
            secondSurname: userFound.secondSurname,
            birthDate: userFound.birthDate,
            gender: userFound.gender,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });

        // Responde con todos los datos del usuario
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            nip: userFound.nip,
            role: userFound.role,
            firstName: userFound.firstName,
            secondName: userFound.secondName,
            firstSurname: userFound.firstSurname,
            secondSurname: userFound.secondSurname,
            birthDate: userFound.birthDate,
            gender: userFound.gender,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Controlador para verificar el token de acceso
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    console.log("token verificado", token);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verifica la validez del token
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });

        // Busca al usuario por su ID obtenido del token
        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "Unauthorized" });

        res.cookie('token', token, {
            httpOnly: true, // Seguridad, la cookie no se puede acceder con JavaScript
            secure: true, // Solo si la aplicación está en producción (HTTPS)
            sameSite: 'None', // Permite que la cookie se envíe en contextos cross-origin
            maxAge: 24 * 60 * 60 * 1000 // Duración de la cookie (1 día)
        });

        // Responde con los datos del usuario
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            nip: userFound.nip,
            role: userFound.role,
            firstName: userFound.firstName,
            secondName: userFound.secondName,
            firstSurname: userFound.firstSurname,
            secondSurname: userFound.secondSurname,
            birthDate: userFound.birthDate,
            gender: userFound.gender,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
    });
};