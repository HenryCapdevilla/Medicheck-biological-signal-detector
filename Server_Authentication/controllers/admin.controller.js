// controllers/adminController.js
import Whitelist from '../models/MedicoWhitelist.js';

export const addToWhitelist = async (req, res) => {
    const { nip } = req.body;

    try {
        // Verifica si el NIP ya está en la whitelist
        const nipExists = await Whitelist.findOne({ nip });
        if (nipExists) {
            return res.status(400).json(['The NIP is already in the whitelist']);
        }

        // Agrega el NIP a la whitelist
        const newEntry = new Whitelist({ nip });
        await newEntry.save();

        res.status(200).json({ message: 'NIP added to whitelist successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
