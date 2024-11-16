import __dirname from "./index.js";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determinar el tipo de archivo
        const fileType = file.mimetype.split('/')[0];

        // Definir la carpeta dependiendo del tipo de archivo
        let folder = '';

        if (fileType === 'image') {
            folder = 'public/img/pets';  // Carpeta para imágenes de mascotas
        } else if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword') {
            folder = 'public/img/documents';  // Carpeta para documentos
        }

        // Llamar al callback con la carpeta correspondiente
        cb(null, `${__dirname}/../${folder}`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({ storage });

export default uploader;

