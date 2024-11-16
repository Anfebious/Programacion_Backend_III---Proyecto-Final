import { usersService } from "../services/index.js"
import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js';
import { generateUserErrorInfo } from '../services/errors/info.js'
import bcrypt from 'bcryptjs';

const createUser = async(req, res, next) => {
    const { first_name, last_name, email, password, role } = req.body;
    
    // Validación básica de campos
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send({ status: 'error', message: 'Missing required fields' });
    }
    
    // Verifica si el usuario ya existe
    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser) {
        return res.status(400).send({ status: 'error', message: 'Email already in use' });
    }

    try {
        // Hashea la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea el nuevo usuario con la contraseña hasheada
        const newUser = await usersService.create({ first_name, last_name, email, password: hashedPassword, role });

        res.send({ status: 'success', message: 'User created', payload: newUser });
    } catch (error) {
        return next(error);
    }
}

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res, next)=>{
    const updateBody = req.body;
    if(!updateBody.first_name || !updateBody.last_name || !updateBody.email){
        const error = CustomError.createError({
            name:"User Update Error",
            cause:generateUserErrorInfo(updateBody),
            message:"Error Trying to update User",
            code: EErrors.INVALID_TYPES_ERROR
        })
        return next(error); // Esto se necesita para que lo atrape el middleware que maneja las excepciones
    }
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    // Si la contraseña fue actualizada, la encriptamos de nuevo
    if (updateBody.password) {
        try {
            updateBody.password = await bcrypt.hash(updateBody.password, 10);
        } catch (err) {
            return next(err);
        }
    }
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}

const uploadDocuments = async (req, res) => {
    const { uid } = req.params;

    // Verificar que se hayan subido archivos
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ status: "error", message: "No files uploaded" });
    }

    // Buscar al usuario
    const user = await usersService.getUserById(uid);
    if (!user) return res.status(404).send({ status: "error", message: "User not found" });

    // Crear un array de documentos con la información de los archivos subidos
    const newDocuments = req.files.map(file => ({
        name: file.originalname,
        reference: `/img/${file.filename}`
    }));

    // Actualizar los documentos del usuario
    user.documents = user.documents.concat(newDocuments);
    await usersService.update(uid, { documents: user.documents });

    res.send({ status: "success", message: "Files uploaded", payload: user.documents });
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadDocuments,
}